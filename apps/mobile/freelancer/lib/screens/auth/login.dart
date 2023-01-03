import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import "package:mobile/components/gradient.dart";
import 'package:mobile/components/input.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();

  @override
  void dispose() {
    super.dispose();
    emailController.dispose();
    passwordController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: null,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(15.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    "Welcome Back!",
                    style: GoogleFonts.outfit(fontSize: 28, fontWeight: FontWeight.w700),
                  ),
                  // Center(
                  //   child: GradientText(
                  //     'Lend My Skill',
                  //     style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w700),
                  //     gradient: const LinearGradient(colors: [Color(0xff3b82f6), Color(0xff2dd4bf)], begin: Alignment.topLeft, tileMode: TileMode.clamp),
                  //   ),
                  // ),
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
                    autoFocus: true,
                    keyboardType: TextInputType.emailAddress,
                    controller: emailController,
                  ),
                  const SizedBox(
                    height: 20,
                  ),
                  InputField(
                    labelText: "Password",
                    autoFocus: false,
                    keyboardType: TextInputType.visiblePassword,
                    controller: passwordController,
                  ),
                  const SizedBox(height: 20),
                  TextButton(
                    onPressed: () {},
                    style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.all<Color>(Colors.black),
                      padding: MaterialStateProperty.all<EdgeInsets>(const EdgeInsets.all(8)),
                      enableFeedback: true,
                      foregroundColor: MaterialStateProperty.all<Color>(Colors.white),
                      shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                        const RoundedRectangleBorder(
                          borderRadius: BorderRadius.all(
                            Radius.circular(8),
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
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
