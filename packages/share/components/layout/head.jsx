import { config } from "@/theme/config.js";
import Head from "next/head";
import Favicon from "./favicon";

export default function AppHead() {
  const url = `https://${config.domain}`;
  const ogImageUrl = `${url}/api/ogImg`;

  return (
    <Head>
      <title>{config.title}</title>
      <meta name="description" content={config.description} key="description" />

      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        key="viewport"
      />

      <meta property="og:url" content={url} key="ogUrl" />
      <meta property="og:type" content="website" key="ogType" />
      <meta property="og:title" content={config.title} key="ogTitle" />
      <meta
        property="og:description"
        content={config.description}
        key="ogDesc"
      />
      <meta property="og:image" content={ogImageUrl} key="ogImage" />

      <meta
        name="twitter:card"
        content="summary_large_image"
        key="twitterCard"
      />
      <meta
        property="twitter:domain"
        content={config.domain}
        key="twitterDomain"
      />
      <meta property="twitter:url" content={url} key="twitterUrl" />
      <meta name="twitter:title" content={config.title} key="twitterTitle" />
      <meta
        name="twitter:description"
        content={config.description}
        key="twitterDesc"
      />
      <meta name="twitter:image" content={ogImageUrl} key="twitterImg" />

      <Favicon />
    </Head>
  );
}
