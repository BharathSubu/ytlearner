"use client";

// pages/opfs-test.tsx
import { useState } from 'react';

const OpfsTestPage = () => {
  const [output, setOutput] = useState('');

  const log = (message: string) => {
    setOutput((prevOutput) => `${prevOutput}${message}\n`);
  };

  const createFile = async () => {
    try {
      const root = await navigator.storage.getDirectory();
      await root.getFileHandle('test.txt', { create: true });
      log('File "test.txt" created.');
    } catch (error) {
      log(`Error creating file: ${error}`);
    }
  };

  const writeFile = async () => {
    try {
      const root = await navigator.storage.getDirectory();
      const fileHandle = await root.getFileHandle('test.txt');
      const writable = await fileHandle.createWritable();
      await writable.write('Hello, OPFS!');
      await writable.close();
      log('Written "Hello, OPFS!" to "test.txt".');
    } catch (error) {
      log(`Error writing to file: ${error}`);
    }
  };

  const readFile = async () => {
    try {
      const root = await navigator.storage.getDirectory();
      const fileHandle = await root.getFileHandle('test.txt');
      const file = await fileHandle.getFile();
      const contents = await file.text();
      log(`Contents of "test.txt": ${contents}`);
    } catch (error) {
      log(`Error reading file: ${error}`);
    }
  };

  const deleteFile = async () => {
    try {
      const root = await navigator.storage.getDirectory();
      await root.removeEntry('test.txt');
      log('File "test.txt" deleted.');
    } catch (error) {
      log(`Error deleting file: ${error}`);
    }
  };

  return (
    <div>
      <h1>Origin Private File System (OPFS) Test</h1>
      <button onClick={createFile}>Create File</button>
      <button onClick={writeFile}>Write to File</button>
      <button onClick={readFile}>Read from File</button>
      <button onClick={deleteFile}>Delete File</button>
      <pre>{output}</pre>
    </div>
  );
};

export default OpfsTestPage;
