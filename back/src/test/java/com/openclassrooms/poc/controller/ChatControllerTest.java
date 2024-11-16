package com.openclassrooms.poc.controller;

import com.openclassrooms.poc.model.ChatMessage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
public class ChatControllerTest {
    @Autowired
    private ChatController chatController;

    @MockBean
    private SimpMessagingTemplate simpMessagingTemplate;

    @Test
    void testSendMessage() {
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setContent("Hello");
        chatMessage.setSender("Client");
        chatMessage.setRole("Client");
        chatController.sendMessage(chatMessage);

        assertEquals("Client", chatMessage.getRole());
        assertEquals("Hello", chatMessage.getContent());
        assertNotNull(chatMessage.getTimestamp());    }


}