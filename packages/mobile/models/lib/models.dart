library models;

class Profile {
  final String? avatarUrl;
  final String? bio;
  final String country;
  final String createdAt;
  final String id;
  final String name;
  final String username;
  final bool verified;
  final bool profileCompleted;
  final String? aboutMe;
  const Profile({
    this.avatarUrl,
    this.bio,
    required this.country,
    required this.createdAt,
    required this.id,
    required this.name,
    required this.username,
    required this.verified,
    required this.profileCompleted,
    this.aboutMe,
  });
  factory Profile.fromJSON(Map<String, dynamic> json) {
    return Profile(
      avatarUrl: json['avatarUrl'],
      bio: json['bio'],
      country: json['country'],
      createdAt: json['createdAt'],
      id: json['id'],
      name: json['name'],
      username: json['username'],
      verified: json['verified'],
      profileCompleted: json['profileCompleted'],
      aboutMe: json['aboutMe'],
    );
  }
}
