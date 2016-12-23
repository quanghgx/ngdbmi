var ngdbmi = require("./ngdbmi.js");

/* Create a new GDB instance over ./a.out with args foo and bar */
gdb = new ngdbmi('/home/quanghgx/Projects/eip_stm32f103_firebull_board/build/ch.elf');

/* Register handlers */

/* Notify event */
gdb.on("notify", function (state) {
    console.log('NOTIFY> ' + JSON.stringify(state, null, "\t"));
});

/* Application output */
gdb.on("app", function (line) {
    console.log("APP>" + line);
});

/* Gdb output */
gdb.on("gdb", function (line) {
    console.log("GDB>" + line);
});

/* Gdb close event */
gdb.on("close", function (return_code, signal) {
    console.log("GDB closed RET=" + return_code);
});

gdb.command("version", function (state) {
    console.log('VERSION ' + JSON.stringify(state, null, "\t"));

    gdb.command("targetSelect", function (state) {
        console.log('TARGET_SELECT ' + JSON.stringify(state, null, "\t"));

        gdb.command("set", function (state) {
            console.log('SET ASYNC ' + JSON.stringify(state, null, "\t"));

            gdb.command("show", function (state) {
                console.log('SHOW ASYNC ' + JSON.stringify(state, null, "\t"));

                /* Lets insert a breakpoint at "bar" */
                gdb.command("breakInsert", function (state) {
                    console.log('BREAKPOINT ' + JSON.stringify(state, null, "\t"));

                    /* Launch the debugee */
                    gdb.command("run", function (state) {
                        console.log('RUN ' + JSON.stringify(state, null, "\t"));

                        /* Generate a backtrace */
                        gdb.command("stackListFrames", function (state) {
                            console.log('FRAMES ' + JSON.stringify(state, null, "\t"));
                            gdb.command("exit");
                        });

                    });
                }, {
                    location: "main"
                });
            }, {
                name: "mi-async"
            });

        }, {
            name: "mi-async",
            value: "on"
        });
    }, {
        type: "remote",
        param: "localhost:4242"
    });
});

