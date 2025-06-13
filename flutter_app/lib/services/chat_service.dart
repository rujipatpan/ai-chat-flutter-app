import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import '../models/message.dart';
import '../models/ai_provider.dart';

class ChatService extends ChangeNotifier {
  static const String baseUrl = 'http://localhost:3000/api';
  
  final List<Message> _messages = [];
  final List<AIProvider> _providers = [];
  bool _isLoading = false;
  String? _error;
  String _selectedProvider = 'mock';

  List<Message> get messages => List.unmodifiable(_messages);
  List<AIProvider> get providers => List.unmodifiable(_providers);
  bool get isLoading => _isLoading;
  String? get error => _error;
  String get selectedProvider => _selectedProvider;

  void addMessage(Message message) {
    _messages.add(message);
    notifyListeners();
  }

  void updateMessage(String id, Message updatedMessage) {
    final index = _messages.indexWhere((msg) => msg.id == id);
    if (index != -1) {
      _messages[index] = updatedMessage;
      notifyListeners();
    }
  }

  void setSelectedProvider(String providerId) {
    _selectedProvider = providerId;
    notifyListeners();
  }

  Future<void> loadProviders() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/providers'));
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        _providers.clear();
        for (var providerData in data['providers']) {
          _providers.add(AIProvider.fromJson(providerData));
        }
        _selectedProvider = data['default'] ?? 'mock';
        notifyListeners();
      }
    } catch (e) {
      print('Failed to load providers: $e');
    }
  }

  Future<void> sendMessage(String content) async {
    if (content.trim().isEmpty) return;

    // Add user message
    final userMessage = Message(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      content: content,
      isUser: true,
      timestamp: DateTime.now(),
    );
    addMessage(userMessage);

    // Add AI message placeholder
    final aiMessageId = (DateTime.now().millisecondsSinceEpoch + 1).toString();
    final aiMessage = Message(
      id: aiMessageId,
      content: '',
      isUser: false,
      timestamp: DateTime.now(),
      status: MessageStatus.sending,
    );
    addMessage(aiMessage);

    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final response = await http.post(
        Uri.parse('$baseUrl/chat'),
        headers: {
          'Content-Type': 'application/json',
        },
        body: json.encode({
          'message': content,
          'provider': _selectedProvider,
        }),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final updatedAiMessage = aiMessage.copyWith(
          content: data['response'] ?? 'ขออภัย ไม่สามารถตอบได้ในขณะนี้',
          status: MessageStatus.sent,
        );
        updateMessage(aiMessageId, updatedAiMessage);
      } else {
        throw Exception('Failed to get AI response: ${response.statusCode}');
      }
    } catch (e) {
      _error = e.toString();
      final errorMessage = aiMessage.copyWith(
        content: 'เกิดข้อผิดพลาด: ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้',
        status: MessageStatus.error,
      );
      updateMessage(aiMessageId, errorMessage);
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearMessages() {
    _messages.clear();
    _error = null;
    notifyListeners();
  }

  Future<bool> checkServerHealth() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/health'));
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }

  AIProvider? getSelectedProviderInfo() {
    return _providers.firstWhere(
      (provider) => provider.id == _selectedProvider,
      orElse: () => AIProvider(
        id: 'mock',
        name: 'Mock AI',
        available: true,
        description: 'Simple responses for testing',
      ),
    );
  }
}