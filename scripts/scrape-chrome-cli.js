import { exec } from "child_process";

// https://www.dgae.unam.mx/Licenciatura2021/resultados/1/12710005.html

// Use chrome-cli to execute the script
// Note: you need to have chrome-cli installed on OSX and Chrome open
// Use only single quotes 
let scriptDefinition = /*html*/`
<script>
  (() => {
    let url = 'https://www.dgae.unam.mx/Licenciatura2021/resultados/1/12710005.html';
    window.isLoading = true;
    fetch(url).then(response => response.text()).then(text => {
      // domparser
      let parser = new DOMParser();
      let doc = parser.parseFromString(text, 'text/html');
      let table = doc.querySelector('table');
      let rows = [...table.querySelectorAll('tr')];
      let data = [];
      // let headers = [...rows[0].querySelectorAll('th')].map(th => th.innerHTML);
      // first row is the header, so skip it
      for (let i = 2; i < rows.length; i++) {
        let row = rows[i];
        let cells = [...row.querySelectorAll('td')];
        let obj = {};
        // only first three cells
        data.push(cells.slice(0, 3).map(cell => cell.innerHTML));
      }
      window.result = JSON.stringify(data);
      window.isLoading = false;
    });
  })();
</script>
`;

// extract the part inside the <script> tags with regex and capture the first match
let script = scriptDefinition.match(/<script>([\s\S]*?)<\/script>/m)[1].trim();

console.log(`Running script: ${script.split('\n').length} lines`);
// help menu
// chrome-cli execute <javascript>  (Execute javascript in active tab)
// chrome-cli execute <javascript> -t <id>  (Execute javascript in specific tab)

// template: chrome-cli execute ${script}
// run a shell command in node in a child proccess
exec(`chrome-cli execute "${script}"`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  // console.log(stdout);
  // constantly check window.isLoading until it is false
  // if it is false, then the result is in window.result
  let maxCheck = 10;
  const check = () => exec(`chrome-cli execute 'window.isLoading'`, (err, stdout, stderr) => {
    // stdout is the result of window.isLoading
    const isDone = stdout.trim() === "0";
    console.log(`Loading... ${isDone ? "done" : ""}`);
    if (isDone) {
      const file = `./data/test.json`;
      exec(`chrome-cli execute 'window.result' > ${file}`, (err, stdout, stderr) => {
        console.log(`Result saved to ${file}`);
      });
    } else if (maxCheck-- > 0) {
      setTimeout(check, 1000);
    }
  });
  check();
});


