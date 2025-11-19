import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';

const StyledNewsSection = styled.section`
  max-width: 900px;
  padding: 60px 0;

  @media (max-width: 768px) {
    padding: 50px 0;
  }

  @media (max-width: 480px) {
    padding: 30px 0;
  }

  .news-heading {
    font-size: clamp(20px, 4vw, 24px);
    margin: 0 0 25px 0;
    color: var(--color-text-primary);
    font-weight: 600;
  }

  .news-container {
    max-height: 400px;
    height: 200px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 10px;
    border-radius: var(--border-radius);

    @media (max-width: 768px) {
      max-height: 300px;
      height: 300px;
    }

    @media (max-width: 480px) {
      max-height: 250px;
      height: 250px;
    }

    /* Custom scrollbar */
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-bg-secondary);
      border-radius: 4px;
      opacity: 0.5;

      &:hover {
        opacity: 0.8;
      }
    }

    /* Firefox scrollbar */
    scrollbar-width: thin;
    scrollbar-color: var(--color-bg-secondary) transparent;
  }

  .news-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(236, 223, 204, 0.1);
    gap: 20px;

    &:last-child {
      border-bottom: none;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .news-date {
      color: var(--color-accent);
      font-family: var(--font-mono);
      font-size: var(--fz-md);
      font-weight: 500;
      flex-shrink: 0;
      min-width: 100px;

      @media (max-width: 768px) {
        min-width: auto;
      }
    }

    .news-content {
      color: var(--color-text-secondary);
      font-size: var(--fz-lg);
      line-height: 1.5;
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;

      a {
        ${({ theme }) => theme.mixins.inlineLink};
        color: var(--color-accent);
        font-size: inherit;

        &:after {
          width: 100% !important;
        }
      }
    }
  }
`;

const News = () => {
  const data = useStaticQuery(graphql`
    query {
      news: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/news/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        edges {
          node {
            frontmatter {
              date
              emoji
            }
            html
          }
        }
      }
    }
  `);

  // Format date to "Month YYYY" format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const newsList = data.news.edges
    .filter(({ node }) => node)
    .map(({ node }) => ({
      node,
      sortDate: new Date(node.frontmatter.date),
    }))
    .sort((a, b) => b.sortDate - a.sortDate); // DESC order (newest first)

  return (
    <StyledNewsSection id="news">
      <h2 className="news-heading">News</h2>
      
      <div className="news-container">
        {newsList && newsList.length > 0 ? (
          newsList.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { date, emoji } = frontmatter;

            return (
              <div key={i} className="news-item">
                <div className="news-date">{formatDate(date)}</div>
                <div className="news-content">
                  {emoji && <span>{emoji}</span>}
                  <span dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="news-item">
            <div className="news-content">No news items yet.</div>
          </div>
        )}
      </div>
    </StyledNewsSection>
  );
};

export default News;

