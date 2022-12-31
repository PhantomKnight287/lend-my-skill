import 'package:get/get.dart';

class UserController extends GetxController {
  var id = "".obs;
  var name = "".obs;
  var username = "".obs;
  var userType = "".obs;
  var profileCompleted = false.obs;

  void setUserData(String id, String name, String username, String userType, bool profileCompleted) {
    this.id.value = id;
    this.name.value = name;
    this.username.value = username;
    this.userType.value = userType;
    this.profileCompleted.value = profileCompleted;
  }

  void logout() {
    this.id.value = "";
    this.name.value = "";
    this.username.value = "";
    this.userType.value = "";
    this.profileCompleted.value = false;
  }
}
