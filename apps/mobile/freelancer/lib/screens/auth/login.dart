import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import "package:components/gradient_text.dart";
import 'package:components/outlined_input_field.dart';
import 'package:mobile/screens/auth/register.dart';

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
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(15.0, 0, 15.0, 15.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Navigator.canPop(context)
                    ? Container(
                        decoration: BoxDecoration(
                          color: Colors.grey[200],
                          borderRadius: BorderRadius.circular(50),
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.arrow_back),
                          onPressed: () => Navigator.pop(context),
                        ),
                      )
                    : Container(),
                const SizedBox(
                  height: 50,
                ),
                const Image(
                  image: AssetImage("assets/brand/lms-logo.png"),
                  height: 200,
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
                  onPressed: () {},
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
                          MaterialPageRoute(
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
