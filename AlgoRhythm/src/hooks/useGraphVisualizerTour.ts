import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useGraphTour = () => {

    const startTour = () => {
        const driverObj = driver({
            popoverClass: 'driverjs-theme',
            showProgress: true,
            stageRadius: 10,
            nextBtnText: 'Next',
            prevBtnText: 'Back',
            doneBtnText: 'I am ready!',
            progressText: 'Step {{current}} out of {{total}}',
            overlayColor: '#535151',
            overlayOpacity: 0.85,
            steps: [
                {
                    popover: {
                        title: "AlgoVisualize",
                        description: "Welcome to interactive tool for visualizing graph algorithms! Here is a short description how to use it"
                    }
                },
                {
                    element: '#canvas',
                    popover: {
                        title: 'Graph canvas',
                        description: 'Here you can manipulate your graph. Click on the canvas to insert a new node or select other options from the side bar.',
                        side: "right",
                        align: 'start'
                    }
                },
                {
                    element: '#toolbar',
                    popover: {
                        title: 'Toolbar',
                        description: 'Switch between modes, you can modify graph or generate a random one. After selecting a node you can also set is as start or end (if your algorithm needs it)',
                        side: "right",
                        align: 'start'
                    }
                },
                {
                    element: "#node-operations",
                    popover: {
                        title: 'Start or end',
                        description: 'If your algorithm needs to use these values, simply set the vertices and then use them in code.',
                        side: "left",
                        align: 'start'
                    }
                },
                {
                    element: '#editor',
                    popover: {
                        title: 'Code editor',
                        description: 'Here you can write your code to be visualized. You can also change the width of editor.',
                        side: "left",
                        align: 'start'
                    }
                },
                {
                    element: '#run-code',
                    popover: {
                        title: 'Start animation',
                        description: 'Click "RUN CODE" to start the animation.',
                        side: "left",
                        align: 'start',
                    }
                },
                {
                    element: '#editor',
                    popover: {
                        title: "API",
                        description: "Currently available methods are described in the editor comment.",
                        side: "left",
                    }
                },
                {
                    element: "#logs",
                    popover: {
                        title: 'Logs',
                        description: 'Here you can see all of the logs that you printed during execution',
                        side: "left",
                        align: 'start'
                    }
                },
            ]
        });

        driverObj.drive();
    };

    return { startTour };
};