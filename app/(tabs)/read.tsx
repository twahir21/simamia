import { File, Paths } from 'expo-file-system';

try {
  const file = new File(Paths.cache, 'example.txt');
//   file.create(); // can throw an error if the file already exists or no permission to create it
  file.write('Hello, world!');
  console.log("File: ", file.uri)
  console.log(file.textSync()); // Hello, world!
} catch (error) {
  console.error(error);
}
