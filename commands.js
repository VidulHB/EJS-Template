const chalk = require("chalk");
const os = require("os");
const { Command } = require("commander");
const program = new Command();
const { QuickDB } = require("quick.db");
const db = new QuickDB();

program.name("commands").description("Some Commands").version("0.1.0");

program
  .command("uptime")
  .description("Returns The Uptime of The WebApp")
  .action(async () => {
    let sec = await db.get("uptime");
    process.stdout.write(
      chalk.bgCyanBright.bold(" [System] Getting Web Service Uptime... ")
    );
    async function checkuptime() {
      if (sec === (await db.get("uptime"))) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(
          chalk.bgRedBright.bold(` [System] Web Service is Offline `)
        );
      } else {
        let min = sec / 60;
        let hour = min / 60;
        sec = Math.floor(sec);
        min = Math.floor(min);
        hour = Math.floor(hour);
        hour = hour % 60;
        min = min % 60;
        sec = sec % 60;
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(
          chalk.bgGreenBright.bold(
            ` [System] Web Service Has Been Online For ${hour} Hour(s), ${min} Minute(s) and ${sec} Second(s) \n`
          )
        );
      }
    }
    setTimeout(checkuptime, 1000);
  });

// program
//   .command("ram")
//   .description("Returns The RAM Usage of The Web Service")
//   .action(async () => {
//     const osu = require("os-utils");
//     const asciichart = require("asciichart");
//     var array = [];
//     let type = "MB";
//     function graph() {
//       let ram = osu.totalmem() - osu.freemem();
//       if (Math.max(...array) - Math.min(...array) > 50) {
//         var array_2 = Array(array.length);
//         for (var i = 0, length = array.length; i < length; i++) {
//           array_2[i] = array[i] / divisor;
//         }
//         array.push(Math.round(ram / 100) / 10);
//         type = "GB";
//       } else {
//         array.push(Math.round(ram * 10) / 10);
//         type = "MB";
//       }
//       if (array.length > 142) {
//         array.splice(0, 1);
//       }
//       console.clear();
//       let usagetext = `Usage - ${array[array.length - 1]} ${type}`;
//       let lasttxt = `Usage In Last ${array.length}s: Min - ${Math.min(
//         ...array
//       )}${type}, Max - ${Math.max(...array)}${type}, Avg - ${
//         Math.round(
//           (array.reduce(
//             (accumulator, currentValue) => accumulator + currentValue,
//             0
//           ) /
//             array.length) *
//             10
//         ) / 10
//       }${type}`;
//       process.stdout.write(
//         asciichart.plot(array) +
//           "\n" +
//           `${" ".repeat((150 - usagetext.length) / 2)}${usagetext} \n` +
//           `${" ".repeat((150 - lasttxt.length) / 2)}${lasttxt}`
//       );
//       setTimeout(graph, 1000);
//     }
//     setTimeout(graph, 1000);
//   });

program
  .command("system-information")
  .description("Returns The System Information of The Web Service")
  .action(async () => {
    process.stdout.write(chalk.bgCyanBright.bold(' [System] Getting System Information... '))
    const si = require("systeminformation");
    const machine = await si.system();
    const bios = await si.bios();
    const cpu = await si.cpu();
    const mem = await si.mem()
    function virtual(virtual) {
      if (virtual === true) {
        return chalk.bgBlueBright.bold(
          ` [Virtual Host] ${machine.virtualHost} `
        );
      } else {
        return chalk.bgBlueBright.bold(` [Virtual] False `);
      }
    }
    function convert(num) {
      if(num > 1000){
        num = num/1000
        num = Math.round(num*100)/100
        if(num > 1000){
          num = num/1000
          num = Math.round(num*100)/100
          if(num > 1000){
            num = num/1000
            num = Math.round(num*100)/100
            return `${num} GB`
          }else{
            return `${num} MB`
          }
        }else{
          return `${num} KB`
        }
      }
    }

    function simsg() {
      let msg = chalk.bgGreenBright.bold(` [System] Machine Information: `) + "\n" 
      + chalk.bgBlueBright.bold(` [Manufacturer] ${machine.manufacturer} `) + "\n" 
      + chalk.bgBlueBright.bold(` [Model] ${machine.model} `) + "\n" 
      + chalk.bgBlueBright.bold(` [Serial] ${machine.serial} `) + "\n" 
      + virtual(machine.virtual) + "\n" + "\n"
      + chalk.bgGreenBright.bold(` [System] BIOS Information: `) + "\n" 
      + chalk.bgBlueBright.bold(` [Vendor] ${bios.vendor}`) + "\n" 
      + chalk.bgBlueBright.bold(` [Version] ${bios.version} `) + "\n" 
      + chalk.bgBlueBright.bold(` [Release] ${bios.releaseDate} `) + "\n" 
      + chalk.bgBlueBright.bold(` [Serial] ${bios.serial} `) + "\n" +"\n" 
      + chalk.bgGreenBright.bold(` [System] CPU Information: `) +"\n" 
      + chalk.bgBlueBright.bold(` [CPU] ${cpu.manufacturer} , ${cpu.brand} `) +"\n" 
      + chalk.bgBlueBright.bold(` [Family & Model] ${cpu.family} , ${cpu.model} `) + "\n" 
      + chalk.bgBlueBright.bold(` [Min & Max Speed] ${cpu.speedMin}GHz , ${cpu.speedMax}GHz `) +"\n"
      + chalk.bgBlueBright.bold(` [Processors & Cores] ${cpu.processors} , ${cpu.cores} `) + "\n"
      + chalk.bgBlueBright.bold(` [Virtualization] ${cpu.virtualization} `) + "\n" + "\n"
      + chalk.bgGreenBright.bold(` [System] RAM Information: `) + "\n" 
      + chalk.bgBlueBright.bold(` [Total] ${convert(mem.total)} `) +"\n"
      + chalk.bgBlueBright.bold(` [Used] ${convert(mem.used)} `) +"\n"
      + chalk.bgBlueBright.bold(` [Free] ${convert(mem.free)} `) +"\n"
      + chalk.bgBlueBright.bold(` [SwapTotal] ${convert(mem.swaptotal)} `) +"\n"
      + chalk.bgBlueBright.bold(` [SwapUsed] ${convert(mem.swapused)} `) +"\n"
      + chalk.bgBlueBright.bold(` [SwapFree] ${convert(mem.swapfree)} `) +"\n";
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      return msg
    }

        process.stdout.write(simsg());
  });
program.parse();
