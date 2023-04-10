import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

const API_KEY = "Your Api Key here ........";
const systemMessage = {
  "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
}

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm a bot 😎 How Can I help.! 😁",
      sentTime: "just now",
      sender: "Bot"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);

    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) { 

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "Bot") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message}
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,  
        ...apiMessages 
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", 
    {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "Bot"
      }]);
      setIsTyping(false);
    });
  }

  return (
    <div className="App" style={{display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'20px' , backgroundColor:'#ddd'}}>
      <p className='display-2 me-3 p-3 bg-primary rounded-5 text-white'>Basic ChatGpt <br /> Bot</p>
      <div style={{ position:"relative", height: "800px", width: "700px" , padding:'20px 20px'}}>
        <MainContainer style={{borderRadius:'20px', border:'3px solid black', boxShadow:'12px 14px 37px -3px gray'}}>
          <ChatContainer style={{padding:'20px 20px'}}>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="Bot is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} style={{backgroundColor:'white'}} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
}

export default App
