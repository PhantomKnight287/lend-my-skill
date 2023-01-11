// ignore_for_file: unnecessary_string_escapes, use_build_context_synchronously

import 'package:components/gradient_text.dart';
import 'package:components/outlined_input_field.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:country_picker/country_picker.dart';
import 'package:mobile/constants/main.dart';
import 'package:mobile/screens/auth/login.dart';
import 'package:services/services.dart' as s;

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final confirmPasswordController = TextEditingController();
  final usernameController = TextEditingController();
  final nameController = TextEditingController();
  final countryController = TextEditingController();

  String emailError = "";
  String passwordError = "";
  String confirmPasswordError = "";
  String usernameError = "";
  String nameError = "";
  String countryError = "";

  @override
  void dispose() {
    super.dispose();
    emailController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
    usernameController.dispose();
    nameController.dispose();
  }

  int _currentStep = 0;

  void register() async {
    setState(() {
      emailError = "";
      passwordError = "";
      confirmPasswordError = "";
      usernameError = "";
      nameError = "";
      countryError = "";
    });
    if (emailController.text.isEmpty) {
      return setState(() {
        emailError = "Please enter an email address";
        _currentStep = 0;
      });
    }
    final bool emailValid = RegExp(r"^\S+@\S+$").hasMatch(emailController.text);
    if (emailValid == false) {
      return setState(() {
        emailError = "Please enter a valid email address";
        _currentStep = 0;
      });
    }
    if (passwordController.text == "") {
      return setState(() {
        passwordError = "Please enter a password";
        _currentStep = 0;
      });
    }

    if (passwordController.text != confirmPasswordController.text) {
      return setState(() {
        confirmPasswordError = "Password and Confirm Password doesn't match";
        _currentStep = 0;
      });
    }
    if (passwordController.text.length < 8) {
      return setState(() {
        passwordError = "Password must include 8 characters";
        _currentStep = 0;
      });
    }
    if (usernameController.text.length < 3) {
      return setState(() {
        usernameError = "Username must be 3 characters long";
        _currentStep = 0;
      });
    }

    final res =
        await s.register(Uri.parse("$API_URL/freelancer/auth/register"), {
      "email": emailController.text,
      "password": passwordController.text,
      "confirmPassword": confirmPasswordController.text,
      "username": usernameController.text,
      "name": nameController.text
    });
    if (res['error'] == true) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(res['message'])));
      return;
    }
    Navigator.pushReplacement(
        context, CupertinoPageRoute(builder: (context) => const LoginScreen()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        elevation: 0,
        shadowColor: Colors.transparent,
        foregroundColor: Colors.black,
        backgroundColor: Colors.transparent,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.fromLTRB(15.0, 0, 15.0, 15.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              mainAxisSize: MainAxisSize.min,
              children: [
                const Center(
                  child: Image(
                    image: AssetImage("assets/brand/lms-logo-cropped.png"),
                    height: 200,
                    width: 200,
                  ),
                ),
                const SizedBox(height: 5),
                Center(
                  child: Text(
                    "Welcome To",
                    style: GoogleFonts.outfit(
                      fontSize: 28,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                Center(
                  child: GradientText(
                    "Lend My Skill",
                    gradient: const LinearGradient(
                      colors: [Color(0xff3b82f6), Color(0xff2dd4bf)],
                    ),
                    style: GoogleFonts.outfit(
                        fontSize: 30, fontWeight: FontWeight.w700),
                  ),
                ),
                const SizedBox(
                  height: 5,
                ),
                Flexible(
                  fit: FlexFit.loose,
                  child: Theme(
                    data: ThemeData(
                      colorScheme: Theme.of(context)
                          .colorScheme
                          .copyWith(primary: const Color(0xff3b82f6)),
                    ),
                    child: Stepper(
                      steps: [
                        Step(
                          title: Text(
                            "Login Information",
                            style: GoogleFonts.outfit(),
                          ),
                          content: Column(
                            children: [
                              InputField(
                                autoFocus: false,
                                keyboardType: TextInputType.emailAddress,
                                controller: emailController,
                                inputDecoration: InputDecoration(
                                  labelStyle: GoogleFonts.outfit(fontSize: 18),
                                  hintText: "Email",
                                  prefixIcon: const Icon(Icons.email),
                                  border: InputBorder.none,
                                  prefixIconColor: Colors.grey,
                                  fillColor: Colors.grey.shade200,
                                  filled: true,
                                  focusedBorder: OutlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                  enabledBorder: UnderlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                  hintStyle: GoogleFonts.outfit(),
                                  errorText: emailError,
                                  errorBorder: UnderlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                  focusedErrorBorder: UnderlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 5),
                              InputField(
                                autoFocus: false,
                                keyboardType: TextInputType.name,
                                controller: usernameController,
                                inputDecoration: InputDecoration(
                                  labelStyle: GoogleFonts.outfit(fontSize: 18),
                                  hintText: "Username",
                                  prefixIcon: const Icon(Icons.alternate_email),
                                  border: InputBorder.none,
                                  prefixIconColor: Colors.grey,
                                  fillColor: Colors.grey.shade200,
                                  filled: true,
                                  focusedBorder: OutlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                  enabledBorder: UnderlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                  hintStyle: GoogleFonts.outfit(),
                                  errorText: usernameError,
                                  errorBorder: UnderlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                  focusedErrorBorder: UnderlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 5),
                              InputField(
                                autoFocus: false,
                                keyboardType: TextInputType.visiblePassword,
                                controller: passwordController,
                                inputDecoration: InputDecoration(
                                  labelStyle: GoogleFonts.outfit(fontSize: 18),
                                  hintText: "Password",
                                  prefixIcon: const Icon(Icons.lock),
                                  border: InputBorder.none,
                                  prefixIconColor: Colors.grey,
                                  fillColor: Colors.grey.shade200,
                                  filled: true,
                                  errorText: passwordError,
                                  focusedBorder: OutlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                  enabledBorder: UnderlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                  hintStyle: GoogleFonts.outfit(),
                                  errorBorder: UnderlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                  focusedErrorBorder: UnderlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                ),
                              ),
                              const SizedBox(
                                height: 5,
                              ),
                              InputField(
                                autoFocus: false,
                                keyboardType: TextInputType.visiblePassword,
                                controller: confirmPasswordController,
                                inputDecoration: InputDecoration(
                                  errorText: confirmPasswordError,
                                  labelStyle: GoogleFonts.outfit(fontSize: 18),
                                  hintText: "Confirm Password",
                                  prefixIcon: const Icon(Icons.lock),
                                  border: InputBorder.none,
                                  prefixIconColor: Colors.grey,
                                  fillColor: Colors.grey.shade200,
                                  filled: true,
                                  focusedBorder: OutlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                  enabledBorder: UnderlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                  hintStyle: GoogleFonts.outfit(),
                                  errorBorder: UnderlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                  focusedErrorBorder: UnderlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Step(
                          title: Text(
                            "Personal Information",
                            style: GoogleFonts.outfit(),
                          ),
                          content: Column(
                            children: [
                              InputField(
                                autoFocus: false,
                                keyboardType: TextInputType.name,
                                controller: nameController,
                                inputDecoration: InputDecoration(
                                  errorText: nameError,
                                  labelStyle: GoogleFonts.outfit(fontSize: 18),
                                  hintText: "Name",
                                  prefixIcon: const Icon(
                                    Icons.person,
                                    color: Color(0xff3b82f6),
                                  ),
                                  border: InputBorder.none,
                                  prefixIconColor: Colors.grey,
                                  fillColor: Colors.grey.shade200,
                                  filled: true,
                                  focusedBorder: OutlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                  enabledBorder: UnderlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                  hintStyle: GoogleFonts.outfit(),
                                  errorBorder: UnderlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                  focusedErrorBorder: UnderlineInputBorder(
                                    borderSide:
                                        const BorderSide(color: Colors.white),
                                    borderRadius: BorderRadius.circular(25.7),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 5),
                              GestureDetector(
                                  onTap: () {
                                    showCountryPicker(
                                      context: context,
                                      countryListTheme: CountryListThemeData(
                                        flagSize: 25,
                                        backgroundColor: Colors.white,
                                        textStyle: const TextStyle(
                                            fontSize: 16,
                                            color: Colors.blueGrey),
                                        bottomSheetHeight:
                                            500, // Optional. Country list modal height
                                        //Optional. Sets the border radius for the bottomsheet.
                                        borderRadius: const BorderRadius.only(
                                          topLeft: Radius.circular(20.0),
                                          topRight: Radius.circular(20.0),
                                        ),
                                        //Optional. Styles the search field.
                                        inputDecoration: InputDecoration(
                                          labelText: 'Search',
                                          hintText: 'Start typing to search',
                                          prefixIcon: const Icon(Icons.search),
                                          border: OutlineInputBorder(
                                            borderSide: BorderSide(
                                              color: const Color(0xFF8C98A8)
                                                  .withOpacity(0.2),
                                            ),
                                          ),
                                        ),
                                      ),
                                      onSelect: (Country c) {
                                        countryController.text =
                                            c.displayNameNoCountryCode;
                                      },
                                    );
                                  },
                                  child: InputField(
                                    autoFocus: false,
                                    enabled: false,
                                    keyboardType: TextInputType.name,
                                    controller: countryController,
                                    inputDecoration: InputDecoration(
                                      errorText: countryError,
                                      labelStyle:
                                          GoogleFonts.outfit(fontSize: 18),
                                      hintText: "Country",
                                      prefixIcon: const Icon(
                                        Icons.flag,
                                        color: Color(0xff3b82f6),
                                      ),
                                      border: InputBorder.none,
                                      prefixIconColor: Colors.grey,
                                      fillColor: Colors.grey.shade200,
                                      filled: true,
                                      focusedBorder: OutlineInputBorder(
                                        borderSide: const BorderSide(
                                            color: Colors.white),
                                        borderRadius:
                                            BorderRadius.circular(25.7),
                                      ),
                                      enabledBorder: UnderlineInputBorder(
                                        borderSide: const BorderSide(
                                            color: Colors.white),
                                        borderRadius:
                                            BorderRadius.circular(25.7),
                                      ),
                                      disabledBorder: UnderlineInputBorder(
                                        borderSide: const BorderSide(
                                            color: Colors.white),
                                        borderRadius:
                                            BorderRadius.circular(25.7),
                                      ),
                                      hintStyle: GoogleFonts.outfit(),
                                      errorBorder: UnderlineInputBorder(
                                        borderSide: const BorderSide(
                                            color: Colors.white),
                                        borderRadius:
                                            BorderRadius.circular(25.7),
                                      ),
                                      focusedErrorBorder: UnderlineInputBorder(
                                        borderSide: const BorderSide(
                                            color: Colors.white),
                                        borderRadius:
                                            BorderRadius.circular(25.7),
                                      ),
                                    ),
                                  )),
                              const SizedBox(height: 5),
                            ],
                          ),
                        ),
                      ],
                      currentStep: _currentStep,
                      type: StepperType.vertical,
                      onStepContinue: () {
                        setState(() {
                          if (_currentStep < 2 - 1) {
                            _currentStep++;
                          } else {
                            _currentStep = 0;
                          }
                        });
                      },
                      elevation: 0,
                      onStepCancel: () {
                        setState(() {
                          if (_currentStep > 0) {
                            _currentStep--;
                          } else {
                            _currentStep = 0;
                          }
                        });
                      },
                      onStepTapped: (value) =>
                          setState(() => _currentStep = value),
                      controlsBuilder: (context, details) {
                        return Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            const SizedBox(
                              height: 25,
                            ),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.center,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                if (_currentStep != 0)
                                  ElevatedButton(
                                      onPressed: details.onStepCancel,
                                      style: ButtonStyle(
                                        shape: MaterialStateProperty.all<
                                            RoundedRectangleBorder>(
                                          const RoundedRectangleBorder(
                                            borderRadius: BorderRadius.all(
                                              Radius.circular(25.7),
                                            ),
                                          ),
                                        ),
                                      ),
                                      child: Text("Back",
                                          style: GoogleFonts.outfit())),
                                const SizedBox(
                                  width: 25,
                                ),
                                ElevatedButton(
                                  onPressed: _currentStep == 0
                                      ? details.onStepContinue
                                      : register,
                                  style: ButtonStyle(
                                    shape: MaterialStateProperty.all<
                                        RoundedRectangleBorder>(
                                      const RoundedRectangleBorder(
                                        borderRadius: BorderRadius.all(
                                          Radius.circular(25.7),
                                        ),
                                      ),
                                    ),
                                  ),
                                  child: Text(
                                      _currentStep == 1 ? "Create" : "Continue",
                                      style: GoogleFonts.outfit()),
                                ),
                              ],
                            )
                          ],
                        );
                      },
                    ),
                  ),
                )
              ],
            ),
          ),
        ),
      ),
    );
  }
}
