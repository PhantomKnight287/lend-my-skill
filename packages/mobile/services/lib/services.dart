library services;

import 'dart:convert';

import "package:http/http.dart";

dynamic register(Uri url, Object body) async {
  Response req = await post(url, body: body);
  final res = jsonDecode(req.body);
  if (req.statusCode != 200 && req.statusCode != 201) {
    return {"error": true, "message": res['errors']?[0]?['message'] ?? res['message']};
  }
  return res;
}

dynamic login(Uri url, Object body) async {
  Response req = await post(url, body: body);

  final res = jsonDecode(req.body);
  if (req.statusCode != 200 && req.statusCode != 201) {
    return {"error": true, "message": res['message']};
  }
  return res;
}

dynamic hydrateController(Uri url, String token) async {
  Response req = await get(url, headers: {"authorization": "Bearer $token"});
  final res = jsonDecode(req.body);
  if (req.statusCode != 200 && req.statusCode != 201) {
    return {"error": true, "message": res['message']};
  }
  return res;
}
