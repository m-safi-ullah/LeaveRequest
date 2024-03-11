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

        $sql = "SELECT * FROM emplogin WHERE empEmail = :username AND empPass = :password";
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
}


  elseif ($method === 'GET') {
    try {
        $sql = "SELECT * FROM emplogin";
        $stmt = $conn->prepare($sql);

        if ($stmt->execute()) {
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response = ['status' => 1, 'data' => $data];
            echo json_encode($response);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 0, 'message' => 'Error: ' . $e->getMessage()]);
    }
} elseif ($method === 'DELETE') {
    $user = json_decode(file_get_contents('php://input'), true);

    try {
        $sql = "DELETE FROM emplogin WHERE empID=:empID";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':empID', $user['empID']);
        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
            echo json_encode($response);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 0, 'message' => 'Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 0, 'message' => 'Invalid request method']);
}
?>
