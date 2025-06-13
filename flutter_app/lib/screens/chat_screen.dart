import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/chat_service.dart';
import '../models/message.dart';
import '../widgets/message_bubble.dart';
import '../widgets/message_input.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final ScrollController _scrollController = ScrollController();
  bool _serverHealthy = false;

  @override
  void initState() {
    super.initState();
    _checkServerHealth();
  }

  void _checkServerHealth() async {
    final chatService = Provider.of<ChatService>(context, listen: false);
    final isHealthy = await chatService.checkServerHealth();
    setState(() {
      _serverHealthy = isHealthy;
    });
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'AI Chat Assistant',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            icon: Icon(
              _serverHealthy ? Icons.cloud_done : Icons.cloud_off,
              color: _serverHealthy ? Colors.green : Colors.red,
            ),
            onPressed: _checkServerHealth,
            tooltip: _serverHealthy ? 'Server Online' : 'Server Offline',
          ),
          PopupMenuButton<String>(
            onSelected: (value) {
              if (value == 'clear') {
                _showClearDialog();
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'clear',
                child: Row(
                  children: [
                    Icon(Icons.clear_all),
                    SizedBox(width: 8),
                    Text('ล้างข้อความทั้งหมด'),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
      body: Column(
        children: [
          if (!_serverHealthy)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              color: Colors.orange.shade100,
              child: Row(
                children: [
                  const Icon(Icons.warning, color: Colors.orange),
                  const SizedBox(width: 8),
                  const Text('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้'),
                  const Spacer(),
                  TextButton(
                    onPressed: _checkServerHealth,
                    child: const Text('ลองใหม่'),
                  ),
                ],
              ),
            ),
          Expanded(
            child: Consumer<ChatService>(
              builder: (context, chatService, child) {
                final messages = chatService.messages;
                
                WidgetsBinding.instance.addPostFrameCallback((_) {
                  _scrollToBottom();
                });

                if (messages.isEmpty) {
                  return const Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.chat_bubble_outline,
                          size: 64,
                          color: Colors.grey,
                        ),
                        SizedBox(height: 16),
                        Text(
                          'เริ่มสนทนากับ AI Assistant',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey,
                          ),
                        ),
                        SizedBox(height: 8),
                        Text(
                          'พิมพ์ข้อความด้านล่างเพื่อเริ่มต้น',
                          style: TextStyle(
                            color: Colors.grey,
                          ),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(16),
                  itemCount: messages.length,
                  itemBuilder: (context, index) {
                    final message = messages[index];
                    return MessageBubble(
                      message: message,
                      isUser: message.isUser,
                    );
                  },
                );
              },
            ),
          ),
          MessageInput(
            onSendMessage: (message) {
              final chatService = Provider.of<ChatService>(context, listen: false);
              chatService.sendMessage(message);
            },
            enabled: _serverHealthy,
          ),
        ],
      ),
    );
  }

  void _showClearDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('ล้างข้อความทั้งหมด'),
        content: const Text('คุณต้องการลบข้อความทั้งหมดหรือไม่?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('ยกเลิก'),
          ),
          TextButton(
            onPressed: () {
              final chatService = Provider.of<ChatService>(context, listen: false);
              chatService.clearMessages();
              Navigator.pop(context);
            },
            child: const Text('ลบ'),
          ),
        ],
      ),
    );
  }
}