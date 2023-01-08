import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:controllers/user.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/screens/auth/login.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MaterialApp(
      title: 'Lend My Skill',
      theme: ThemeData(primaryColor: Colors.blueAccent, fontFamily: GoogleFonts.outfit().fontFamily),
      home: const RouteHandler(),
      debugShowCheckedModeBanner: false,
    ),
  );
}

class RouteHandler extends StatefulWidget {
  const RouteHandler({super.key});

  @override
  State<RouteHandler> createState() => _RouteHandlerState();
}

class _RouteHandlerState extends State<RouteHandler> {
  UserController c = Get.put(UserController());
  @override
  Widget build(BuildContext context) {
    // ignore: unrelated_type_equality_checks
    if (c.id == "") return const LoginScreen();
    return Container();
  }
}
