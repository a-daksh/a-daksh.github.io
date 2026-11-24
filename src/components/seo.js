import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import { socialMedia } from '@config';

/**
 * SEO + social-preview tags. Used from each page's Gatsby Head export:
 *   export const Head = ({ location }) => <Seo pathname={location.pathname} title="..." />;
 * https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 * (<html lang> is set in gatsby-ssr.js.)
 */
const Seo = ({ pathname, title, description, image }) => {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          defaultTitle: title
          defaultDescription: description
          siteUrl
          defaultImage: image
          author
          keywords
        }
      }
    }
  `);

  const { defaultTitle, defaultDescription, siteUrl, defaultImage, author, keywords } =
    site.siteMetadata;

  const seo = {
    title: title ? `${title} | ${defaultTitle}` : defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
  };

  // schema.org Person, used by search engines for the knowledge panel.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author,
    url: siteUrl,
    image: seo.image,
    description: defaultDescription,
    jobTitle: 'AI Engineer',
    worksFor: {
      '@type': 'Organization',
      name: 'Foundation Robotics',
      url: 'https://foundation.bot/',
    },
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Carnegie Mellon University' },
      { '@type': 'CollegeOrUniversity', name: 'Indian Institute of Technology Guwahati' },
    ],
    knowsAbout: ['Robotics', 'Robot Learning', 'Reinforcement Learning', 'Dexterous Manipulation'],
    sameAs: socialMedia.map(({ url }) => url),
    // No email here on purpose: it would be scrapable from the page source (see src/utils/email.js).
  };

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={seo.url} />

      {/* Open Graph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:image:alt" content="Daksh Adhar's portfolio homepage" />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={defaultTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@DakshAdhar" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>

      <meta name="google-site-verification" content="samEnOLU4vT-NbHCtGuTKBKxASYyAwqdsYvLoI4sHMk" />
    </>
  );
};

Seo.propTypes = {
  pathname: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};

export default Seo;
