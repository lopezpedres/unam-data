let selectedLinks = [...document.querySelectorAll("body > p > a")]
  // TODO: remove this once ready for download all course data
  .filter((el, i) => i < 3);

Promise.all(
  selectedLinks
    .map((el) => el.getAttribute("href"))
    .map((link) => `https://www.dgae.unam.mx/Febrero2017/resultados/${link}`)
    .map((link) => fetch(link))
)
  .then((responses) => {
    return Promise.all(responses.map((r) => r.text())).then((htmls) => {
      // map through htmls and parse to json
      const result = htmls.map((html, courseIdx) => {
        // parse the html document
        const parser = new DOMParser();
        // cleanup html by removing all the font tags
        const cleanHtml = html
          .replace(/<font[^>]*>/g, "")
          .replace(/<\/font>/g, "");

        const doc = parser.parseFromString(cleanHtml, "text/html");

        // console.log(doc);
        let result = doc.body.innerHTML
          .toString()
          .split("<br>")
          // parse it back into an html document
          .map((line) => {
            const parser = new DOMParser();
            // const html = `
            const doc = parser.parseFromString(line, "text/html");
            return doc.body.innerText.toString();
          })
          .filter((line) => line.length > 0)
          // filter out first five lines
          .filter((el, i) => i > 4);

        // console.log(result.filter((el, i) => i < 20));

        result = result
          .map((i) => i.split(" "))
          .map((row) => {
            if (Number.isNaN(parseInt(row[1]))) {
              // coerce string to integer for row[0]
              return [parseInt(row[0]), null, row[1]];
            }
            if (row[2] === undefined)
              return [parseInt(row[0]), parseInt(row[1])];
            return [parseInt(row[0]), parseInt(row[1]), row[2]];
          })
          .map((row) => {
            // add the link to the beginning of the row
            const courseName = selectedLinks[courseIdx].innerText.trim();
            // link example: 1/1010035.html
            // extract "1010035" from the link
            const courseId = selectedLinks[courseIdx]
              .getAttribute("href")
              .split("/")[1]
              .split(".")[0];
            return [courseName, courseId, ...row];
          });
        // console.log(result);
        // csv format
        // const csv = result
        //   .filter((el, i) => i > 9)
        //   .map((row) => row.join(","))
        //   .join("\n");
        // return the csv
        return result;
      });
      // console.log(result);
      return result;
    });
  })
  .then((result) => {
    console.log(result);
  });
