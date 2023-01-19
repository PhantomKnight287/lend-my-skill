library services;

import 'dart:convert';

import 'package:models/profile.dart' as p;
import 'package:http/http.dart' as http;
import "package:models/editable.dart" as e;

Future<p.Profile> fetchProfile(Uri url, {String? token}) async {
  http.Response res;
  if (token != null) {
    res = await http.get(url, headers: {"authorization": "Bearer $token"});
  } else {
    res = await http.get(url);
  }

  return p.Profile.fromJSON(jsonDecode(res.body));
}

Future<e.Editable> checkIsEditable(Uri url, String token) async {
  http.Response res = await http.get(url, headers: {"authorization": "Bearer $token"});
  return e.Editable.fromJSON(jsonDecode(res.body));
}
