import React from "react";
import Layout from "components/layout/Layout";
import Insight from "components/Insight";
import { Container, Grid, Typography, Avatar } from "@material-ui/core";
import { getAllInsight } from "lib/index";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: theme.spacing(9), // 추가: 내용과 흰색 배경 사이에 공간을 만듭니다
    margin: theme.spacing(10),
  },
  contentWrapper: {
    position: "relative",
    margin: "0 auto", // 가로 마진을 자동으로 설정하면, 화면 크기에 관계없이 중앙에 고정됩니다.
    maxWidth: "1280px", // 원하는 최대 너비 값을 설정하세요. 이 값에 따라 가로 폭이 제한됩니다.
    padding: theme.spacing(0, 0),
  },
}));

export async function getStaticProps() {
  const insights = await getAllInsight();
  return { revalidate: 1, props: { insights } };
}

export default function Report({ insights }) {
  const classes = useStyles();

  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 정보를 저장할 state 변수
  const postsPerPage = 10; // 한 페이지당 보여줄 게시글 수
  const noPosts = insights.length === 0;

  // 현재 페이지에 보여줄 게시글의 시작/끝 index 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = insights.slice(indexOfFirstPost, indexOfLastPost); // 현재 페이지에 보여줄 게시글 목록

  // 페이지 번호 목록을 만드는 함수
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(insights.length / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Layout>
      <div className={classes.contentWrapper}>
        <div className={classes.background}>
          <Container maxWidth="md">
            <Grid container spacing={4} justify="center">
              <Grid item xs={12}>
                <Typography variant="h2" component="h1" align="left" gutterBottom style={{ fontWeight: "bold" }}>
                  인사이트
                </Typography>
              </Grid>
              {noPosts ? (
                <Grid item xs={12} style={{ textAlign: "center" }}>
                  <div>
                    <img src="/empty-folder.svg" alt="Empty folder" style={{ width: '30px' }} />
                  </div>
                  <Typography variant="subtitle1" align="center" gutterBottom color="textSecondary">
                    게시물 없습니다.
                  </Typography>
                </Grid>
              ) : (

              <Grid container spacing={4} justify="center">
                <Grid item xs={12}>
                  <Grid container spacing={5} justify="center">
                    {insights?.map(({ fields, sys }) => (
                      <Grid item key={fields.title} xs={12}>
                        <Insight
                          title={fields.title}
                          type="insight" // 이 부분을 추가합니다.
                          coverImage={fields.cover?.fields?.file?.url} // 이 부분을 수정합니다.
                          content={fields.content}
                          slug={fields.title}
                          createdAt={sys.createdAt} // 이 부분을 추가합니다.
                        />
                      </Grid>
                    ))}
                  </Grid>

                  {/* 페이지 번호 목록을 출력 */}
                  <Grid
                    container
                    spacing={2}
                    justify="center"
                    style={{ marginTop: "2rem" }}
                  >
                    {pageNumbers.map((number) => (
                      <Grid item key={number}>
                        <button onClick={() => setCurrentPage(number)}>
                          {number}
                        </button>
                      </Grid>
                    ))}
                  </Grid>
                  
                </Grid>
              </Grid>
              )}
            </Grid>
          </Container>
        </div>
      </div>
    </Layout>
  );
}
