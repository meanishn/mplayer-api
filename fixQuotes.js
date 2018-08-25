const fs = require('fs');

const filePath = 'app/emailHandler/templates/email_doc_ready.html';
fs.readFile(filePath, 'utf8', (err, content) => {
    const fixedContent = content
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"');
    fs.writeFile(filePath, fixedContent, (e) => {
        if (e) throw e;
        console.log('file saved');
    });
});
