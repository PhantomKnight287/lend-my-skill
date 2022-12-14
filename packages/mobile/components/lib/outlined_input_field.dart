import "package:flutter/material.dart";
import 'package:google_fonts/google_fonts.dart';

class InputField extends StatelessWidget {
  final String? labelText;
  final Function(String)? onChanged;
  final Function(String)? onSubmitted;
  final String? errorText;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final bool autoFocus;
  final bool obscureText;
  final Widget? suffix;
  final TextEditingController? controller;
  final Widget? prefix;
  final InputDecoration? inputDecoration;
  final TextAlign? textAlign;
  final bool? enabled;
  const InputField(
      {this.labelText,
      this.onChanged,
      this.onSubmitted,
      this.errorText,
      this.keyboardType,
      this.textInputAction,
      this.autoFocus = false,
      this.obscureText = false,
      this.suffix,
      this.controller,
      this.prefix,
      this.inputDecoration,
      this.textAlign,
      this.enabled,
      Key? key})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextField(
      autofocus: autoFocus,
      onChanged: onChanged,
      onSubmitted: onSubmitted,
      keyboardType: keyboardType,
      textInputAction: textInputAction,
      obscureText: obscureText,
      textAlign: textAlign ?? TextAlign.start,
      enabled: enabled,
      decoration: inputDecoration ??
          InputDecoration(
            labelText: labelText,
            labelStyle: GoogleFonts.spaceGrotesk(),
            errorText: errorText,
            floatingLabelBehavior: FloatingLabelBehavior.always,
            suffix: suffix,
            prefix: prefix,
          ),
      controller: controller,
    );
  }
}
