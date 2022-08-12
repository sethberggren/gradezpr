# Gradezpr

<a href="https://github.com/sethberggren/gradezpr-client"><h2>Frontend Link</h2></a>

<a href="https://github.com/sethberggren/gradezpr-extension"><h2>Extension Link</h2></a>

<a href="https://gradezpr.iceberggren.com"><h2>Live Web App Link</h2></a>

<br></br>


This is the backend for my web app, Gradezpr. Gradezpr was born of a desire to make the grading process as a teacher quicker. I found myself doing the same repetitive tasks over and over, like correcting student names to match the gradebook, curving grades, and looking at summary statistics for assignments. Gradezpr was designed to do all of these tasks and more.

<br></br>

Gradezpr's main feature is its ability to automatically match up student information in assignments scoresheets on Google Sheets or Excel files with the 'official' student information the end-user uploads. This is beneficial as sometimes the assignment scoresheets have pseudonyms for students (Ben vs. Benjamin, for example), which can cause errors for importing grades into Learning Managment Systems, like PowerSchool.

<br></br>

Gradezpr's backend was built using a variety of technologies. Here's a list of notable tools leveraged:

<ul>
<li><a href="https://www.typescriptlang.org">TypeScript </a></li>
<li><a href="https://expressjs.com">Express </a></li>
<li><a href="https://www.mysql.com/">MySQL </a></li>
<li><a href="https://vincit.github.io/objection.js/">Objection.js</a></li>
<li><a href="https://developers.google.com/sheets">Google Drive and Google Sheets APIs</a></li>
<li><a href="https://github.com/exceljs/exceljs">Exceljs</a></li>
<li><a href="https://jestjs.io">Jest</a></li>
<li><a href="https://github.com/visionmedia/supertest">Supertest</a></li>
</ul>


## Usage

If you'd like to run a local copy of Gradezpr's backend on your device to tinker with, here's the steps.

```bash
git clone https://github.com/sethberggren/gradezpr

npm install

npm run tsc -w

cd /dist && node server.js
```

You'll additioanlly need to create an .env file with all of the information specified in the ```config.ts``` file - things like database connections, etc.