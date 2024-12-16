import ejs from 'ejs';
import path from 'path';

const renderEmailTemplate = (payload) => {


  return new Promise((resolve, reject) => {
    ejs.renderFile(
      path.join(process.cwd(), 'src', 'templates', 'email.templates.ejs'),
      { payload },
      (err, html) => {
        if (err) {
          reject('Error rendering EJS template: ' + err);
        } else {
          resolve(html);
        }
      }
    );
  });
};

export default renderEmailTemplate;