<?php

include 'DbConnect.php';

$dbConnection = new DbConnect();
$conn = $dbConnection->db();
if (!$conn) {
    die("Database connection failed");
}
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $user = json_decode(file_get_contents('php://input'), true);

    if (isset($user['username']) && isset($user['password'])) {
        $login = $user['username'];
        $password = $user['password'];

        $sql = "SELECT * FROM adminlogin WHERE adminEmail = :username AND adminPass = :password";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $login);
        $stmt->bindParam(':password', $password);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $response = ['status' => 1, 'message' => 'Successfully.'];
                echo json_encode($response);
        } else {
            echo("Invalid credentials");
        }
    } else {
        echo("Username and password are required");
    }
} else {
    echo("Invalid request method");
}
?>


