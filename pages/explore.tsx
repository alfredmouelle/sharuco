"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import { useAuthContext } from "@/context/AuthContext"
import { useDocument } from "@/firebase/firestore/getDocument"
import {
  getIsPrivateCodeWithPagination,
  useGetIsPrivateCodeWithPagination,
} from "@/firebase/firestore/getIsPrivateCodeWithPagination"
import InfiniteScroll from "react-infinite-scroll-component"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import CardCode from "@/components/card-code"
import Error from "@/components/error"
import { Layout } from "@/components/layout"
import Loader from "@/components/loader"

export default function Explore() {
  const { user } = useAuthContext()
  const pseudo = user?.reloadUserInfo.screenName

  const {
    data: dataUser,
    isLoading: isLoadingUser,
    isError: isErrorUser,
  } = useDocument(pseudo, "users")

  // const {
  //   isLoading: isLoadingPublicCodes,
  //   isError: isErrorPublicCodes,
  //   data: dataPublicCodes,
  // } = useGetIsPrivateCodes(false)

  const [currentData, setCurrentData] = useState([])
  const [lastDocc, setLastDocc] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const {
    isLoading: isLoadingPublicCodes,
    isError: isErrorPublicCodes,
    data,
  } = useGetIsPrivateCodeWithPagination(false)

  useEffect(() => {
    if (data) {
      setCurrentData(data.collections)
      setLastDocc(data.lastDoc)
    }
  }, [data])

  const fetchMorePublicCodes = async () => {
    const { collections, lastDoc: newLastDoc } =
      await getIsPrivateCodeWithPagination(false, lastDocc)
    setLastDocc(newLastDoc)
    setCurrentData([...currentData, ...collections])
    if (collections.length < 15) {
      setHasMore(false)
    }
  }

  return (
    <Layout>
      <Head>
        <title>Sharuco | Explore</title>
        <meta
          name="description"
          content="Sharuco allows you to share code codes that you have found
      useful."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sharuco" />
        <meta
          name="twitter:description"
          content="Discover little bits of code that can help you."
        />
        <meta
          name="twitter:image"
          content="https://sharuco.lndev.me/sharuco-explore.png"
        />

        <meta property="og:title" content="Sharuco Explore" />
        <meta
          property="og:description"
          content="Discover little bits of code that can help you."
        />
        <meta
          property="og:image"
          content="https://sharuco.lndev.me/sharuco-explore.png"
        />
        <meta property="og:url" content="https://sharuco.lndev.me/explore" />
        <meta property="og:type" content="website" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container grid items-center gap-8 pt-6 pb-8 md:py-10">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tighter sm:text-2xl md:text-4xl lg:text-4xl">
            Discover little bits of code that can help you.
          </h1>
          {/* <SearchCode
            dataCodes={dataPublicCodes}
            isLoadingCodes={isLoadingPublicCodes}
            isErrorCodes={isErrorPublicCodes}
          /> */}
        </div>
        <div className="">
          {isLoadingPublicCodes && <Loader />}
          {currentData && (
            <InfiniteScroll
              dataLength={currentData.length}
              next={fetchMorePublicCodes}
              hasMore={!isLoadingPublicCodes && hasMore}
              loader={currentData.length >= 15 && <Loader />}
              className="scrollbar-hide"
            >
              <ResponsiveMasonry
                columnsCountBreakPoints={{
                  659: 1,
                  660: 2,
                  720: 2,
                  990: 3,
                }}
                className="w-full"
              >
                <Masonry gutter="1rem">
                  {currentData.map(
                    (code: {
                      id: string
                      idAuthor: string
                      language: string
                      code: string
                      description: string
                      tags: string[]
                      favoris: string[]
                      isPrivate: boolean
                      currentUser: any
                      comments: any
                    }) => (
                      <CardCode
                        key={code.id}
                        id={code.id}
                        idAuthor={code.idAuthor}
                        language={code.language}
                        code={code.code}
                        description={code.description}
                        tags={code.tags}
                        favoris={code.favoris}
                        isPrivate={code.isPrivate}
                        currentUser={dataUser?.data}
                        comments={code.comments}
                      />
                    )
                  )}
                </Masonry>
              </ResponsiveMasonry>
            </InfiniteScroll>
          )}
          {isErrorPublicCodes && <Error />}
        </div>
      </section>
    </Layout>
  )
}
