import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';

const StyledNewsSection = styled.section`
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
    list-style: none;
    margin: 0;
    padding-left: 0;
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
      align-items: flex-start;
      gap: 8px;

      a {
        ${({ theme }) => theme.mixins.inlineLink};
      }
    }
  }
`;

// Short dated updates. Content: content/news/*.md with `date` and optional `emoji` frontmatter.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// 'YYYY-MM-DD' -> 'Mon YYYY'. Done by hand (not toLocaleString) so the server-rendered HTML and the
// browser always produce identical text, whatever their locale or time zone.
const formatMonth = isoDate => {
  const [year, month] = (isoDate || '').split('-');
  return MONTHS[Number(month) - 1] ? `${MONTHS[Number(month) - 1]} ${year}` : isoDate;
};

const News = () => {
  const data = useStaticQuery(graphql`
    query {
      news: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/news/" } }
        sort: { frontmatter: { date: DESC } }
      ) {
        nodes {
          id
          html
          frontmatter {
            date
            emoji
          }
        }
      }
    }
  `);
  const items = data.news.nodes;

  return (
    <StyledNewsSection id="news">
      <h2 className="news-heading">News</h2>

      <ul className="news-container">
        {items.map(({ id, html, frontmatter: { date, emoji } }) => (
          <li key={id} className="news-item">
            <div className="news-date">{formatMonth(date)}</div>
            <div className="news-content">
              {emoji && <span aria-hidden="true">{emoji}</span>}
              <span dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </li>
        ))}
      </ul>
    </StyledNewsSection>
  );
};

export default News;
