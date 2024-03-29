import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Layout from "components/layout/Layout";
import IronflagHeader from "components/BlogHeader";
import IronflagBody from "components/BlogBody";
import MoreIronflag from "components/MorePost";
import {
  getIronflagBySlug,
  getMoreIronflag,
  getAllIronflagWithSlug,
} from "lib/index";
import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Link from "next/link";
import slugify from "slugify";

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: theme.spacing(9), // 추가: 내용과 흰색 배경 사이에 공간을 만듭니다
    margin: theme.spacing(10),
  },
  contentWrapper: {
    margin: "0 auto", // 가로 마진을 자동으로 설정하면, 화면 크기에 관계없이 중앙에 고정됩니다.
    maxWidth: "1450px", // 원하는 최대 너비 값을 설정하세요. 이 값에 따라 가로 폭이 제한됩니다.
    padding: theme.spacing(0, 0),
  },
  coverImage: {
    maxWidth: "100%", // 이미지의 최대 너비를 부모 요소의 100%로 제한
    height: "auto", // 높이를 자동으로 설정하여 원본 이미지의 비율을 유지
  },
}));

const generateSlug = (title = "") => {
  return slugify(title, {
    lower: true, // 소문자로 변환
    strict: true, // URL에 적합하지 않은 문자 제거
  });
};

export async function getStaticPaths() {
  const allIronflag = await getAllIronflagWithSlug();
  return {
    paths: allIronflag.map((ironflag) => `/ironflag/${ironflag.title}`),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const ironflag = await getIronflagBySlug(params.slug); // 수정
  const moreIronflag = await getMoreIronflag(params.slug); // 수정

  return {
    props: {
      ironflag: ironflag ? ironflag : null,
      moreIronflag: moreIronflag ? moreIronflag : null,
    },
    revalidate: 1,
  };
}

const Ironflag = ({ ironflag, moreIronflag }) => {
  const router = useRouter();
  const classes = useStyles();

  if (!router.isFallback && !ironflag) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout
      title={ironflag?.fields.title}
      description={ironflag?.fields.subTitle}
      ogImage={ironflag?.fields.cover.fields.file.url}
      url={`https://yourwebsite.com/ironflag/${generateSlug(ironflag?.fields.title)}`}
    >
      <div className={classes.contentWrapper}>
        <div className={classes.background}>
          <Grid container direction="column">
            <Grid item>
              <Grid container direction="row" alignItems="center" spacing={1}>
                <Grid item>
                  <Link href="/posts/ironflag/b.stiim">
                    <a>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        style={{ fontSize: "13px" }}
                      >
                        B.TechFIN
                      </Typography>
                    </a>
                  </Link>
                </Grid>
                <Grid item>
                  <Typography>-</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <IronflagHeader
                title={ironflag?.fields.title}
                subtitle={ironflag?.fields.subTitle}
                slug={ironflag?.fields.title}
                date={ironflag?.fields.date}
              />
            </Grid>
          </Grid>
          <IronflagBody
            content={ironflag?.fields.content}
            coverImage={ironflag?.fields.cover?.fields?.file?.url}
          />
          <Container maxWidth="lg" style={{ marginTop: "8em" }}>
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <Typography
                  align="center"
                  gutterBottom
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                ></Typography>
              </Grid>
            </Grid>
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default Ironflag;
