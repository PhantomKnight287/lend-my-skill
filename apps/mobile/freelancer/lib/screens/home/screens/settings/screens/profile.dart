// ignore_for_file: must_be_immutable

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/constants/main.dart';
import 'package:services/profile.dart';
import "package:models/editable.dart" as e;
import 'package:shared_preferences/shared_preferences.dart';

class ProfileScreen extends StatefulWidget {
  bool? fetchEditable = false;
  ProfileScreen({super.key, required this.username, this.fetchEditable});
  String username;

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  bool editable = false;

  void checkIfProfileIsEditable() async {
    final storage = await SharedPreferences.getInstance();
    final token = storage.getString("token");
    if (token == null) return;
    e.Editable editable = await checkIsEditable(Uri.parse("$API_URL/editable/profile/${widget.username}"), token);
    setState(() {
      this.editable = editable.editable;
    });
  }

  @override
  void initState() {
    super.initState();
    if (widget.fetchEditable == true) {
      checkIfProfileIsEditable();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        shadowColor: Colors.transparent,
        backgroundColor: Colors.transparent,
        foregroundColor: Colors.black,
        title: Text(
          "Profile",
          style: GoogleFonts.outfit(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
        actions: editable == true
            ? [
                IconButton(
                  onPressed: () {
                    // Navigator.pushNamed(context, "/edit-profile");
                  },
                  icon: const Icon(Icons.edit),
                ),
              ]
            : null,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(12, 10, 12, 0),
            child: FutureBuilder(
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Center(
                          child: Column(
                            children: [
                              ClipRRect(
                                borderRadius: BorderRadius.circular(25),
                                child: Image(
                                  image: NetworkImage(
                                      snapshot.data?.avatarUrl != null ? "$STORAGE_BUCKET_URL${snapshot.data?.avatarUrl}" : "https://avatars.dicebear.com/api/initials/${snapshot.data!.username}.png"),
                                  width: 100,
                                  height: 100,
                                  repeat: ImageRepeat.noRepeat,
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.fromLTRB(0, 10, 0, 0),
                                child: Column(
                                  children: [
                                    Text(
                                      snapshot.data!.name,
                                      style: GoogleFonts.outfit(
                                        fontSize: 25,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      "@${snapshot.data!.username}",
                                      style: GoogleFonts.outfit(
                                        fontSize: 15,
                                        fontWeight: FontWeight.w300,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        Text(
                          "Display Name",
                          style: GoogleFonts.outfit(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey,
                          ),
                        ),
                        const SizedBox(
                          height: 5,
                        ),
                        Text(
                          snapshot.data!.name,
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        Text(
                          "Bio",
                          style: GoogleFonts.outfit(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey,
                          ),
                        ),
                        const SizedBox(
                          height: 5,
                        ),
                        Text(
                          snapshot.data?.bio ?? "No bio",
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            color: snapshot.data?.bio != null ? Colors.black : Colors.grey,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        Text(
                          "About Me",
                          style: GoogleFonts.outfit(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey,
                          ),
                        ),
                        const SizedBox(
                          height: 5,
                        ),
                        Text(
                          snapshot.data?.aboutMe ?? "No about",
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            color: snapshot.data?.aboutMe != null ? Colors.black : Colors.grey,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        Text(
                          "Country",
                          style: GoogleFonts.outfit(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey,
                          ),
                        ),
                        const SizedBox(
                          height: 5,
                        ),
                        Text(
                          snapshot.data?.country ?? "No country",
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            color: snapshot.data?.country != null ? Colors.black : Colors.grey,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(
                          height: 20,
                        ),
                        Text(
                          "Joined At",
                          style: GoogleFonts.outfit(
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: Colors.grey,
                          ),
                        ),
                        const SizedBox(
                          height: 5,
                        ),
                        Text(
                          snapshot.data?.createdAt != null
                              ? DateTime(
                                  int.parse(snapshot.data!.createdAt.substring(0, 4)),
                                  int.parse(snapshot.data!.createdAt.substring(5, 7)),
                                  int.parse(snapshot.data!.createdAt.substring(8, 10)),
                                ).toString().substring(0, 10).replaceAll("-", "/").split("/").reversed.join("/")
                              : "No date",
                          style: GoogleFonts.outfit(
                            fontSize: 18,
                            color: snapshot.data?.createdAt != null ? Colors.black : Colors.grey,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  );
                } else if (snapshot.hasError) {
                  return Text(snapshot.error.toString());
                }
                return const Center(
                  child: CircularProgressIndicator(),
                );
              },
              future: fetchProfile(
                Uri.parse("$API_URL/profile/${widget.username}"),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
