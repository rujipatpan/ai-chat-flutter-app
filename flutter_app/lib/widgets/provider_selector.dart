import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/chat_service.dart';
import '../models/ai_provider.dart';

class ProviderSelector extends StatelessWidget {
  const ProviderSelector({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<ChatService>(
      builder: (context, chatService, child) {
        final providers = chatService.providers;
        final selectedProvider = chatService.selectedProvider;
        
        if (providers.isEmpty) {
          return const SizedBox.shrink();
        }

        return PopupMenuButton<String>(
          icon: const Icon(Icons.psychology),
          tooltip: 'เลือก AI Provider',
          onSelected: (String providerId) {
            chatService.setSelectedProvider(providerId);
          },
          itemBuilder: (BuildContext context) {
            return providers.map((AIProvider provider) {
              return PopupMenuItem<String>(
                value: provider.id,
                enabled: provider.available,
                child: Row(
                  children: [
                    Icon(
                      _getProviderIcon(provider.id),
                      color: provider.available 
                          ? (selectedProvider == provider.id 
                              ? Theme.of(context).colorScheme.primary
                              : null)
                          : Colors.grey,
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            provider.name,
                            style: TextStyle(
                              fontWeight: selectedProvider == provider.id 
                                  ? FontWeight.bold 
                                  : FontWeight.normal,
                              color: provider.available 
                                  ? null 
                                  : Colors.grey,
                            ),
                          ),
                          Text(
                            provider.description,
                            style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: provider.available 
                                  ? Colors.grey.shade600 
                                  : Colors.grey.shade400,
                            ),
                          ),
                        ],
                      ),
                    ),
                    if (selectedProvider == provider.id)
                      Icon(
                        Icons.check,
                        color: Theme.of(context).colorScheme.primary,
                        size: 20,
                      ),
                    if (!provider.available)
                      const Icon(
                        Icons.lock,
                        color: Colors.grey,
                        size: 20,
                      ),
                  ],
                ),
              );
            }).toList();
          },
        );
      },
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