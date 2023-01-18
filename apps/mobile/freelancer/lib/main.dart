import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:get/get.dart';
import 'package:controllers/user.dart';
import 'package:mobile/screens/auth/login.dart';
import "package:adaptive_theme/adaptive_theme.dart";
import 'package:mobile/screens/home/main.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: ".env");
  runApp(const RouteHandler());
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
    return AdaptiveTheme(
      light: ThemeData(
        colorScheme: ColorScheme.fromSwatch(primarySwatch: Colors.blue).copyWith(secondary: Colors.amber),
      ),
      dark: ThemeData(
        colorScheme: ColorScheme.fromSwatch(primarySwatch: Colors.blue).copyWith(secondary: Colors.amber),
      ),
      initial: AdaptiveThemeMode.light,
      builder: (theme, darkTheme) => GetMaterialApp(
        title: 'Adaptive Theme Demo',
        theme: theme,
        darkTheme: darkTheme,
        home: c.id.value == "" ? const LoginScreen() : const HomeScreen(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}
