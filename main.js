const fs = require('fs').promises;
const path = require('path');
const prompts = require('prompts');
const readline = require('readline');

// Helper function to scan for schematic files
const scanForSchematicFiles = async (dir) => {
  const files = await fs.readdir(dir);
  return files.filter((file) => file.endsWith('.schematic'));
};

(async () => {
  try {
	const modulePath = path.join(__dirname, './dist/index.cjs');
const schematic2schem = require(modulePath).default;

      // Prompt the user to input the directory containing schematic files
      const { directory } = await prompts({
        type: 'text',
        name: 'directory',
        message: 'Enter the directory containing schematic files (enter ./ for current directory):',
      });

      // Scan for schematic files in the input directory
      const schematicFiles = await scanForSchematicFiles(directory);

      // Prompt the user to select schematic files to convert
      const { selectedFiles } = await prompts({
        type: 'multiselect',
        name: 'selectedFiles',
        message: 'Select the schematic files to convert:',
        choices: schematicFiles.map((file) => ({ title: file, value: file })),
      });

      // Convert selected schematic files to schem files
      const convertedFiles = [];
      for (const file of selectedFiles) {
        const inputPath = path.join(directory, file);
        const outputPath = path.join(directory, file.replace('.schematic', '.schem'));

        const data = await fs.readFile(inputPath);
        const schemBuffer = await schematic2schem(data);
        await fs.writeFile(outputPath, schemBuffer);

        convertedFiles.push(outputPath);
      }

      // Print the list of converted files and success message
      console.log('\nConverted files:');
      for (const file of convertedFiles) {
        console.log(file);
      }
      console.log('\nConversion successful.');
      
      // Create a readline interface
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      // Display a message to press any key to exit
      console.log('Press any key to exit...');

      // Set the input stream to raw mode to capture individual key presses
      process.stdin.setRawMode(true);

      // Listen for 'data' events on the input stream
      process.stdin.on('data', () => {
        // Restore the input stream to its original state
        process.stdin.setRawMode(false);
        rl.close();

        // Exit the program
        process.exit();
      });

    } catch (err) {
      console.log("An error occured. Make sure that the directory you selected is accessible and has valid .schematic files in it.\nDetailed error: "+err);
    }

})();