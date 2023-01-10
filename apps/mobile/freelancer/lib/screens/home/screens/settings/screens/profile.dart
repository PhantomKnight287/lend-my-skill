// ignore_for_file: must_be_immutable

import 'package:flutter/cupertino.dart';

class ProfileScreen extends StatefulWidget {
  ProfileScreen({super.key, required this.username});
  String username;
  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: Text(widget.username),
    );
  }
}
