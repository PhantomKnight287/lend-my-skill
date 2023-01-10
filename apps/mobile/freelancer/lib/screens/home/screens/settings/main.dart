// ignore_for_file: unnecessary_null_comparison

import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:controllers/user.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/screens/home/screens/settings/screens/profile.dart';
import 'package:models/models.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  void fetchProfile() async {}
  UserController c = Get.find();
  @override
  Widget build(BuildContext context) {
    if (c == null) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(10),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(50),
                  child: Image(
                    image: NetworkImage(c.avatarUrl != null ? "${dotenv.env["STORAGE_BUCKET_URL"]}${c.avatarUrl}" : "https://avatars.dicebear.com/api/initials/${c.username.value}.png"),
                    width: 80,
                    height: 80,
                    repeat: ImageRepeat.noRepeat,
                  ),
                ),
                const SizedBox(width: 10),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      c.name.value,
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      "@${c.username.string}",
                      style: const TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w300,
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 10),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 10),
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(
                    color: Colors.grey,
                    width: 0.75,
                  ),
                  borderRadius: BorderRadius.circular(5),
                  color: AdaptiveTheme.of(context).mode == AdaptiveThemeMode.dark ? Colors.grey[900] : Colors.grey[200],
                ),
                width: double.infinity,
                child: Padding(
                    padding: const EdgeInsets.fromLTRB(0, 10, 0, 10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Text(
                            "Account",
                            style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w500),
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            Navigator.of(context).push(MaterialPageRoute(
                              builder: (context) => ProfileScreen(username: c.username.value),
                            ));
                          },
                          child: Container(
                            width: double.infinity,
                            decoration: BoxDecoration(
                              color: AdaptiveTheme.of(context).mode == AdaptiveThemeMode.dark ? Colors.grey[900] : Colors.white,
                              borderRadius: BorderRadius.circular(5),
                            ),
                            child: Padding(
                              padding: const EdgeInsets.all(8),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                children: [
                                  const Icon(Icons.person, size: 30),
                                  const SizedBox(width: 10),
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        "Profile",
                                        style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w500),
                                      ),
                                      Text(
                                        "View and edit your profile",
                                        style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w300),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        )
                      ],
                    )),
              ),
            )
          ],
        ),
      ),
    );
  }
}
