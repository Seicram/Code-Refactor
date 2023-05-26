const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

const fileExtensions = {
  '.html': 'HTML',
  '.js': 'JavaScript',
  '.css': 'CSS',
};

const dictionary = {
  outcome: 'the result or consequence of a series of actions',
  HTML: 'Hypertext Markup Language, the standard language for creating web pages',
  CSS: 'Cascading Style Sheets, used to define the presentation of a document',
  JavaScript: 'a high-level programming language used for web development',
  web: 'a network of interconnected documents and resources',
  development: 'the process of creating and improving software or websites',
  project: 'a planned undertaking with defined objectives and deliverables',
  achieve: 'to successfully reach or accomplish a desired goal',
  combination: 'the act of joining or merging different elements',
  utilize: 'to make use of or employ something',
};

function generateBadge(license) {
  return `Licensed under ${license}`;
}

function getFileContent(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.log(`Error reading file '${filePath}': ${error}`);
    return '';
  }
}

function generateSynopsis(fileType) {
  const fileTypeDescriptions = {
    HTML: 'This project includes an HTML file that represents the web page.',
    JavaScript: 'This project includes JavaScript files that provide the interactive functionality of the web page.',
    CSS: 'This project includes a CSS file that defines the styles and layout of the web page.',
  };

  return fileTypeDescriptions[fileType] || '';
}

function generateDescription(title, files) {
  const titleWords = title.split(' ');

  let description = `The "${title}" project is a web development project that aims to achieve an outcome by combining the power of`;

  const outcomeWords = [];
  titleWords.forEach((word) => {
    if (dictionary.hasOwnProperty(word)) {
      outcomeWords.push(dictionary[word]);
    }
  });

  if (outcomeWords.length > 0) {
    description += ` ${outcomeWords.join(', ')} to achieve the desired outcome. `;
  } else {
    description += ` various web development technologies to achieve the desired outcome. `;
  }

  description += `The project utilizes web development technologies such as HTML, CSS, and JavaScript to create a dynamic and interactive web page. `;
  description += `By leveraging the power of these technologies, the project aims to deliver a visually appealing and user-friendly experience. `;
  description += `Through skillful use of HTML for content structure, CSS for styling and layout, and JavaScript for interactivity and behavior, the project strives to create a seamless and engaging web application. `;
  description += `With meticulous attention to detail and a focus on user experience, the project seeks to provide an intuitive and enjoyable web browsing experience. `;
  description += `The combination of HTML, CSS, and JavaScript allows for the creation of a responsive and adaptive design, ensuring the website looks great on various devices and screen sizes. `;
  description += `By following industry best practices and staying up-to-date with modern web development techniques, the project aims to deliver a high-quality web solution that meets the needs of its target audience. `;
  description += `Overall, the "${title}" project represents the application of web development skills and technologies to create a compelling and functional web experience. `;

  return description;
}

function generateUsageSynopsis(title, description, fileTypes) {
  let usageSynopsis = `The "${title}" project offers a practical application of web development skills, showcasing the synergy of HTML, CSS, and JavaScript in building a dynamic and interactive web experience. `;

  if (fileTypes.length > 0) {
    const fileTypesList = fileTypes.map((fileType) => fileType.toLowerCase()).join(', ');
    usageSynopsis += `The project incorporates ${fileTypesList} to enhance the user interface and deliver a visually appealing design. `;
  }

  usageSynopsis += `Users can explore the website and engage with its various features, experiencing the dynamic functionalities enabled by HTML, CSS, and JavaScript. `;
  usageSynopsis += `Whether it's interacting with dynamic content, navigating through intuitive user interfaces, or enjoying the visual aesthetics, users can expect an immersive web experience. `;
  usageSynopsis += `The project encourages user engagement and interactivity through its well-crafted user interface and intuitive navigation. `;
  usageSynopsis += `With a responsive design and cross-browser compatibility, the web page adapts seamlessly to different devices and browsers, ensuring a consistent experience for all users. `;
  usageSynopsis += `By leveraging the power of web development technologies, the "${title}" project provides a robust and interactive web experience that is both visually appealing and user-friendly. `;

  return usageSynopsis;
}

inquirer
  .prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the Title of your Project:',
    },
  ])
  .then((answers) => {
    const title = answers.title.trim();

    if (!title) {
      console.log('Please provide a valid project title.');
      return;
    }

    const license = 'UNC Coding Boot Camp - UNC-Chapel Hill';
    const licenseBadge = generateBadge(license);

    const currentDir = process.cwd();

    const files = fs.readdirSync(currentDir);
    const fileTypes = files
      .map((file) => {
        const extension = path.extname(file);
        return fileExtensions[extension];
      })
      .filter(Boolean);

    const description = generateDescription(title, files);
    const usageSynopsis = generateUsageSynopsis(title, description, fileTypes);

    let readmeContent = `
# ${title}

## Table of Contents

- [Description](#description)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
`;

    const tableOfContents = [];

    if (fileTypes.includes('HTML')) {
      tableOfContents.push('- [HTML](#html)');
      readmeContent += `
## HTML

${generateSynopsis('HTML')}
`;
    }

    if (fileTypes.includes('JavaScript')) {
      tableOfContents.push('- [JavaScript](#javascript)');
      readmeContent += `
## JavaScript

${generateSynopsis('JavaScript')}
`;
    }

    if (fileTypes.includes('CSS')) {
      tableOfContents.push('- [CSS](#css)');
      readmeContent += `
## CSS

${generateSynopsis('CSS')}
`;
    }

    // Append the updated Table of Contents
    readmeContent = readmeContent.replace(
      '## Table of Contents',
      `## Table of Contents\n\n${tableOfContents.join('\n')}`
    );

    readmeContent += `
## Description

${description}

## Usage

${usageSynopsis}

## Credits

This project was developed by Marcies Smith.

## License

${licenseBadge}
`;

    const readmePath = path.join(currentDir, 'README.md');
    fs.writeFile(readmePath, readmeContent, (err) => {
      if (err) throw err;
      console.log('README.md file created successfully.');
    });
  });
