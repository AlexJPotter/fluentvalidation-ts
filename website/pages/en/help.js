/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

function Help(props) {
  const { config: siteConfig, language = '' } = props;
  const { baseUrl, docsUrl } = siteConfig;
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
  const langPart = `${language ? `${language}/` : ''}`;
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

  const supportLinks = [
    {
      content: `Whether you're just looking to get started, or are stuck on an advanced feature, the extensive [documentation](${docUrl(
        'overview.html'
      )}) on this site should be your first port of call. There you'll find a straightforward introduction to the library, detailed guides for common use-cases, and a full API reference.`,
      title: 'Browse the docs',
    },
    {
      content: `The best way to keep up to date on all the latest features and bug fixes is to head over to GitHub and check out the [releases](https://github.com/AlexJPotter/fluentvalidation-ts/releases) page. There you'll find detailed release notes for each new package version, with new features, bug fixes, and breaking changes all clearly explained.`,
      title: 'Stay up to date',
    },
    {
      content: `Can't find what you're looking for in any of the documentation or release notes? Think you've found a bug? Have a great idea for a new feature? Head over to GitHub and take a look at the [open issues](https://github.com/AlexJPotter/fluentvalidation-ts/issues) - if you need to raise a new issue be sure to include as much detail as possible.`,
      title: 'Raise an issue',
    },
  ];

  return (
    <div className="docMainWrapper wrapper helpPage">
      <Container className="mainContainer documentContainer postContainer">
        <div className="post">
          <header className="postHeader">
            <h1>Need help?</h1>
          </header>
          <GridBlock contents={supportLinks} layout="threeColumn" />
        </div>
      </Container>
    </div>
  );
}

module.exports = Help;
