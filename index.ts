import dayjs from "dayjs"
import TwitterApi from "twitter-api-v2"
import { searchString } from "./terms"

const client = new TwitterApi(process.env.BEARER_TOKEN || "").v2

const REPLY_TEXT = "Hello, please take care :)"

async function findTweets(term: string) {
  const start = dayjs().subtract(1, "hour").toISOString()
  const end = dayjs().toISOString()
  const tweets = await client.search(term, {
    start_time: start,
    end_time: end,
  })
  return tweets
}

async function checkAlreadyReplied(tweetId: string, userId: string) {
  const replyUsers = (await client.singleTweet(tweetId)).includes?.users

  if (replyUsers) {
    for (const user of replyUsers) {
      if (user.id === userId) {
        return true
      }
    }
  }

  return false
}

async function main() {
  try {
    const userId = (await client.me()).data.id

    const tweets = await findTweets(searchString)
    for await (const tweet of tweets) {
      const alreadyReplied = await checkAlreadyReplied(tweet.id, userId)
      if (!alreadyReplied) {
        await client.reply(REPLY_TEXT, tweet.id)
      }
    }

    console.log({ rateLimit: tweets.rateLimit })
  } catch (error) {
    console.error(error)
  }
}
main()
