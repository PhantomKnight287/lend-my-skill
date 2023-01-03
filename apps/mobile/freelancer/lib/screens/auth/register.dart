import 'package:components/gradient_text.dart';
import 'package:components/outlined_input_field.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mobile/screens/auth/login.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController confirmPasswordController = TextEditingController();
  TextEditingController usernameController = TextEditingController();
  TextEditingController nameController = TextEditingController();
  TextEditingController countryController = TextEditingController();

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
    countryController.dispose();
  }

  int _currentStep = 0;

  List<Step> Steps = [
    Step(
        title: Text("Login Information"),
        content: Container(
          child: Text("ok"),
        )),
    Step(title: Text("Personal Information"), content: Container()),
  ];

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
        child: Theme(
          data: ThemeData(
            colorScheme: const ColorScheme.light(primary: Colors.black, secondary: Colors.white).copyWith(secondary: Colors.orange),
          ),
          child: Stepper(
            steps: Steps,
            currentStep: _currentStep,
            type: StepperType.horizontal,
            onStepContinue: () {
              setState(() {
                if (_currentStep < Steps.length - 1) {
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
            onStepTapped: (value) => setState(() => _currentStep = value),
            controlsBuilder: (context, details) {
              return Row(
                children: [
                  TextButton(
                    onPressed: details.onStepContinue,
                    child: const Text("Continue"),
                  ),
                  TextButton(
                    onPressed: details.onStepCancel,
                    child: const Text("Back"),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }
}
