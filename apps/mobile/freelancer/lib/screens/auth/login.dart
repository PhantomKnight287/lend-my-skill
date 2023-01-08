// ignore_for_file: use_build_context_synchronously

import 'package:controllers/user.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import "package:components/gradient_text.dart";
import 'package:components/outlined_input_field.dart';
import 'package:mobile/constants/main.dart';
import 'package:mobile/screens/auth/register.dart';
import 'package:mobile/screens/home/main.dart';
import 'package:services/services.dart' as s;
import 'package:shared_preferences/shared_preferences.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  String emailError = "";
  String passwordError = "";

  UserController c = Get.find();

  @override
  void dispose() {
    super.dispose();
    emailController.dispose();
    passwordController.dispose();
  }

  void login() async {
    setState(() {
      emailError = "";
      passwordError = "";
    });
    if (emailController.text.isEmpty) {
      return setState(() {
        emailError = "Please enter an email address";
      });
    }
    final bool emailValid = RegExp(r"^\S+@\S+$").hasMatch(emailController.text);
    if (emailValid == false) {
      return setState(() {
        emailError = "Please enter a valid email address";
      });
    }
    if (passwordController.text == "") {
      return setState(() {
        passwordError = "Please enter a password";
      });
    }
    if (passwordController.text.length < 8) {
      return setState(() {
        passwordError = "Password must include 8 characters";
      });
    }
    final res = await s.login(Uri.parse("$API_URL/login"), {"email": emailController.text, "password": passwordController.text});
    print(res);
    if (res['error'] == true) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(res['message']!),
        ),
      );
      return;
    }

    if (res['user']['type'] != 'freelancer') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("This account doesn't belong a freelancer."),
        ),
      );
      return;
    }
    final prefs = await SharedPreferences.getInstance();
    c.setUserData(res['user']['id'], res['user']['name'], res['user']['username'], res['user']['type'], false, avatarUrl: res['user']['avatarUrl']);
    await prefs.setString("token", res['tokens']['auth']);
    Navigator.pushReplacement(context, CupertinoPageRoute(builder: (context) => const HomeScreen()));
  }

  void hydateState() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");
    if (token != null) {
      final res = await s.hydrateController(Uri.parse("$API_URL/profile"), token);
      if (res['error'] == true) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(res['message']!),
          ),
        );
        return;
      }
      c.setUserData(res['id'], res['name'], res['username'], res['type'], false, avatarUrl: res['avatarUrl']);
      Navigator.pushReplacement(context, CupertinoPageRoute(builder: (context) => const HomeScreen()));
    }
  }

  @override
  void initState() {
    super.initState();
    c = Get.find();
    hydateState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: null,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(15.0, 0, 15.0, 15.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(
                  height: 50,
                ),
                const Center(
                  child: Image(
                    image: AssetImage("assets/brand/lms-logo-cropped.png"),
                    height: 200,
                    width: 200,
                  ),
                ),
                Text(
                  "Welcome Back!",
                  style: GoogleFonts.outfit(fontSize: 28, fontWeight: FontWeight.w700),
                ),
                GradientText(
                  "Its great to see you again!",
                  gradient: const LinearGradient(
                    colors: [Color(0xff3b82f6), Color(0xff2dd4bf)],
                  ),
                  style: GoogleFonts.outfit(fontSize: 20),
                ),
                const SizedBox(
                  height: 20,
                ),
                InputField(
                  labelText: "Email",
                  keyboardType: TextInputType.emailAddress,
                  controller: emailController,
                  errorText: emailError,
                  inputDecoration: InputDecoration(
                      labelStyle: GoogleFonts.outfit(fontSize: 18),
                      hintText: "Email",
                      prefixIcon: const Icon(Icons.email),
                      border: InputBorder.none,
                      prefixIconColor: Colors.grey,
                      fillColor: Colors.grey.shade200,
                      filled: true,
                      focusedBorder: OutlineInputBorder(
                        borderSide: const BorderSide(color: Colors.white),
                        borderRadius: BorderRadius.circular(25.7),
                      ),
                      enabledBorder: UnderlineInputBorder(
                        borderSide: const BorderSide(color: Colors.white),
                        borderRadius: BorderRadius.circular(25.7),
                      ),
                      hintStyle: GoogleFonts.outfit()),
                ),
                const SizedBox(
                  height: 20,
                ),
                InputField(
                  autoFocus: false,
                  keyboardType: TextInputType.visiblePassword,
                  controller: passwordController,
                  errorText: passwordError,
                  inputDecoration: InputDecoration(
                    labelStyle: GoogleFonts.outfit(fontSize: 18),
                    hintText: "Password",
                    prefixIcon: const Icon(Icons.lock),
                    border: InputBorder.none,
                    prefixIconColor: Colors.grey,
                    fillColor: Colors.grey.shade200,
                    filled: true,
                    focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: Colors.white),
                      borderRadius: BorderRadius.circular(25.7),
                    ),
                    enabledBorder: UnderlineInputBorder(
                      borderSide: const BorderSide(color: Colors.white),
                      borderRadius: BorderRadius.circular(25.7),
                    ),
                    hintStyle: GoogleFonts.outfit(),
                  ),
                ),
                const SizedBox(height: 20),
                TextButton(
                  onPressed: login,
                  style: ButtonStyle(
                    backgroundColor: MaterialStateProperty.all<Color>(Colors.black),
                    padding: MaterialStateProperty.all<EdgeInsets>(const EdgeInsets.all(8)),
                    enableFeedback: true,
                    foregroundColor: MaterialStateProperty.all<Color>(Colors.white),
                    shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                      const RoundedRectangleBorder(
                        borderRadius: BorderRadius.all(
                          Radius.circular(25.7),
                        ),
                      ),
                    ),
                  ),
                  child: Text(
                    "Login",
                    style: GoogleFonts.outfit(
                      fontSize: 18,
                    ),
                  ),
                ),
                const SizedBox(
                  height: 30,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      "Don't have an account?",
                      style: GoogleFonts.outfit(fontSize: 16),
                    ),
                    TextButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          CupertinoPageRoute(
                            builder: (context) => const RegisterScreen(),
                          ),
                        );
                      },
                      style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all<Color>(Colors.transparent),
                        padding: MaterialStateProperty.all<EdgeInsets>(const EdgeInsets.all(8)),
                        enableFeedback: true,
                        foregroundColor: MaterialStateProperty.all<Color>(Colors.black),
                        shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                          const RoundedRectangleBorder(
                            borderRadius: BorderRadius.all(
                              Radius.circular(8),
                            ),
                          ),
                        ),
                      ),
                      child: Text(
                        "Register",
                        style: GoogleFonts.outfit(
                          fontSize: 16,
                          color: Colors.blueAccent,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
