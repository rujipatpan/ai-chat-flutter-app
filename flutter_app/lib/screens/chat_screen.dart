import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/chat_service.dart';
import '../models/message.dart';
import '../widgets/message_bubble.dart';
import '../widgets/message_input.dart';
import '../widgets/provider_selector.dart';

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
    _loadProviders();
  }

  void _checkServerHealth() async {
    final chatService = Provider.of<ChatService>(context, listen: false);
    final isHealthy = await chatService.checkServerHealth();
    setState(() {
      _serverHealthy = isHealthy;
    });
  }

  void _loadProviders() async {
    final chatService = Provider.of<ChatService>(context, listen: false);
    await chatService.loadProviders();
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
        title: Consumer<ChatService>(
          builder: (context, chatService, child) {
            final providerInfo = chatService.getSelectedProviderInfo();
            return Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'AI Chat Assistant',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                if (providerInfo != null)
                  Text(
                    providerInfo.name,
                    style: const TextStyle(fontSize: 12),
                  ),
              ],
            );
          },
        ),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          const ProviderSelector(),
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
              } else if (value == 'providers') {
                _showProvidersDialog();
              }
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'providers',
                child: Row(
                  children: [
                    Icon(Icons.settings),
                    SizedBox(width: 8),
                    Text('ตั้งค่า AI'),
                  ],
                ),
              ),
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
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          Icons.chat_bubble_outline,
                          size: 64,
                          color: Colors.grey.shade400,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'เริ่มสนทนากับ AI Assistant',
                          style: TextStyle(
                            fontSize: 18,
                            color: Colors.grey.shade600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'พิมพ์ข้อความด้านล่างเพื่อเริ่มต้น',
                          style: TextStyle(
                            color: Colors.grey.shade500,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Consumer<ChatService>(
                          builder: (context, chatService, child) {
                            final providerInfo = chatService.getSelectedProviderInfo();
                            if (providerInfo != null) {
                              return Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  color: Theme.of(context).colorScheme.surfaceContainerHighest,
                                  borderRadius: BorderRadius.circular(20),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      Icons.psychology,
                                      size: 16,
                                      color: Colors.grey.shade600,
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      'ใช้งาน: ${providerInfo.name}',
                                      style: TextStyle(
                                        color: Colors.grey.shade600,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            }
                            return const SizedBox.shrink();
                          },
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

  void _showProvidersDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('ตั้งค่า AI Provider'),
        content: Consumer<ChatService>(
          builder: (context, chatService, child) {
            final providers = chatService.providers;
            final selectedProvider = chatService.selectedProvider;
            
            return Column(
              mainAxisSize: MainAxisSize.min,
              children: providers.map((provider) {
                return ListTile(
                  leading: Icon(
                    _getProviderIcon(provider.id),
                    color: provider.available 
                        ? (selectedProvider == provider.id 
                            ? Theme.of(context).colorScheme.primary
                            : null)
                        : Colors.grey,
                  ),
                  title: Text(
                    provider.name,
                    style: TextStyle(
                      color: provider.available ? null : Colors.grey,
                    ),
                  ),
                  subtitle: Text(
                    provider.description,
                    style: TextStyle(
                      color: provider.available 
                          ? Colors.grey.shade600 
                          : Colors.grey.shade400,
                    ),
                  ),
                  trailing: selectedProvider == provider.id
                      ? Icon(
                          Icons.check_circle,
                          color: Theme.of(context).colorScheme.primary,
                        )
                      : provider.available
                          ? const Icon(Icons.radio_button_unchecked)
                          : const Icon(Icons.lock, color: Colors.grey),
                  enabled: provider.available,
                  onTap: provider.available
                      ? () {
                          chatService.setSelectedProvider(provider.id);
                          Navigator.pop(context);
                        }
                      : null,
                );
              }).toList(),
            );
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('ปิด'),
          ),
        ],
      ),
    );
  }

  IconData _getProviderIcon(String providerId) {
    switch (providerId) {
      case 'openai':
        return Icons.auto_awesome;
      case 'claude':
        return Icons.smart_toy;
      case 'mock':
      default:
        return Icons.android;
    }
  }
}