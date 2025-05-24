import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';

export default function Help() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="Help" description={siteConfig.tagline}>
      <div className="hero">
        <div className="container">
          <h1 className="hero__title margin-bottom--lg">Need help?</h1>
          <p className="hero__subtitle margin-bottom--lg">
            <strong>fluentvalidation-ts</strong> has been designed with
            simplicity and ease of use in mind.
            <br />
            If you're struggling, check out the following resources.
          </p>
          <div className="row padding-top--md">
            <div className="col col--4">
              <h2>📖 Browse the docs</h2>
              <p>
                Whether you're just looking to get started, or are stuck on an
                advanced feature, the extensive{' '}
                <Link to="/docs/overview">documentation</Link> on this site
                should be your first port of call. There you'll find a
                straightforward introduction to the library, detailed guides for
                common use-cases, and a full API reference.
              </p>
            </div>
            <div className="col col--4">
              <h2>✨ Stay up to date</h2>
              <p>
                The best way to keep up to date on all the latest features and
                bug fixes is to head over to GitHub and check out the{' '}
                <Link to="https://github.com/AlexJPotter/fluentvalidation-ts/releases">
                  releases
                </Link>{' '}
                page. There you'll find detailed release notes for each new
                package version, with new features, bug fixes, and breaking
                changes all clearly explained.
              </p>
            </div>
            <div className="col col--4">
              <h2>🐛 Raise an issue</h2>
              <p>
                Can't find what you're looking for in the documentation or
                release notes? Think you've found a bug? Have a great idea for a
                new feature? Head over to GitHub and take a look at the{' '}
                <Link to="https://github.com/AlexJPotter/fluentvalidation-ts/issues">
                  open issues
                </Link>{' '}
                - if you need to raise a new issue please include as much detail
                as possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
