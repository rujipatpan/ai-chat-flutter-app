class AIProvider {
  final String id;
  final String name;
  final bool available;
  final String description;

  AIProvider({
    required this.id,
    required this.name,
    required this.available,
    required this.description,
  });

  factory AIProvider.fromJson(Map<String, dynamic> json) {
    return AIProvider(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      available: json['available'] ?? false,
      description: json['description'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'available': available,
      'description': description,
    };
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is AIProvider && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() => 'AIProvider(id: $id, name: $name, available: $available)';
}