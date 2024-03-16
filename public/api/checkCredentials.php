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

    $portal = $_GET['portal'];

            if($portal == 'Admin')
            {
                $sql = "SELECT * FROM adminlogin WHERE adminEmail = :username AND adminPass = :password";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':username', $user['username']);
                $stmt->bindParam(':password', $user['password']);
            }
            else if($portal == 'Approver')
            {
                $sql = "SELECT * FROM leaveapprover WHERE approverEmail = :username AND approverPass = :password";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':username', $user['username']);
                $stmt->bindParam(':password', $user['password']);
            }
            else{
                $sql = "SELECT * FROM emplogin WHERE empEmail = :username AND empPass = :password";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':username', $user['username']);
                $stmt->bindParam(':password', $user['password']);
            }

        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $response = ['status' => 1, 'message' => 'Successfully.'];
                echo json_encode($response);
        } else {
            echo("Invalid credentials");
        }
} else {
    echo("Invalid request method");
}
?>


