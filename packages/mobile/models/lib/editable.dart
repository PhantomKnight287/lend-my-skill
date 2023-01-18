library models;

class Editable {
  final bool editable;

  const Editable({this.editable = false});

  factory Editable.fromJSON(Map<String, dynamic> json) {
    return Editable(
      editable: json['editable'],
    );
  }
}
