import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';

export default function Index() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="Home" description={siteConfig.tagline}>
      <Head>
        <title>
          fluentvalidation-ts · Strong, simple, extensible validation.
        </title>
      </Head>
      <div className="hero">
        <div className="container">
          <h1 className="hero__title margin-bottom--lg">
            Strong, simple, extensible validation.
          </h1>
          <p className="hero__subtitle margin-bottom--lg padding-right--xl">
            <strong>fluentvalidation-ts</strong> is a strongly-typed,
            framework-agnostic validation library with an intuitive fluent API
            for building simple or complex validation rules for your TypeScript
            models.
          </p>
          <div className="margin-bottom--lg">
            <Link
              to="/docs/overview"
              className="button button--primary button--lg margin-right--md"
            >
              Get Started
            </Link>
            <Link
              to="https://github.com/alexjpotter/fluentvalidation-ts"
              className="button button--outline button--secondary button--lg"
            >
              GitHub
            </Link>
          </div>
          <div className="row" style={{ marginTop: '10vh' }}>
            <div className="col col--4">
              <h2>💪 Strong</h2>
              <p>
                Written in and specifically designed for TypeScript, allowing
                you to build up strongly-typed validation rules for your models.
                Avoid mistakes, work faster thanks to code completion, and feel
                completely confident when refactoring.
              </p>
            </div>
            <div className="col col--4">
              <h2>✅ Simple</h2>
              <p>
                Super simple to use thanks to its fluent API and built-in rules.
                Get up and running in no time with how-to guides and a full API
                reference. Boasting zero dependencies and a tiny bundle size,
                fluentvalidation-ts is also incredibly lightweight.
              </p>
            </div>
            <div className="col col--4">
              <h2>⚙️ Extensible</h2>
              <p>
                Write your own reusable rules and drop them in with ease when
                the built-in validation rules aren't enough. By leveraging this
                powerful extensibility, you can handle almost any validation
                requirement imaginable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
