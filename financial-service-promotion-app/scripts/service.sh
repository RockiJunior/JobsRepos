module.exports = {
    apps : [{
      name   : "fincomun",
      script : ".dist/main.js",
      error_file : "/opt/oracle/logs/fincomun-error.log",
      out_file : "/opt/oracle/logs/fincomun-out.log"
    }]
  }