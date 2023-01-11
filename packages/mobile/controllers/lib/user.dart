library controllers;

import 'package:get/get.dart';

class UserController extends GetxController {
  var id = "".obs;
  var name = "".obs;
  var username = "".obs;
  var userType = "".obs;
  var profileCompleted = false.obs;
  String? avatarUrl;

  void setUserData(String id, String name, String username, String userType,
      bool profileCompleted,
      {String? avatarUrl}) {
    this.id.value = id;
    this.name.value = name;
    this.username.value = username;
    this.userType.value = userType;
    this.profileCompleted.value = profileCompleted;
    this.avatarUrl = avatarUrl;
  }

  void logout() {
    id.value = "";
    name.value = "";
    username.value = "";
    userType.value = "";
    profileCompleted.value = false;
  }
}
