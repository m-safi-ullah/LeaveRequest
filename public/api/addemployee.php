<?php
include 'DbConnect.php';

$dbConnection = new DbConnect();
$conn = $dbConnection->db();
if (!$conn) {
    die("Database connection failed");
}

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case "POST":
        try {
            $sql = "INSERT INTO emplogin (empName, empEmail, empPass)
                    VALUES (:empName, :empEmail, :empPassword)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':empName', $_POST['empName']);
            $stmt->bindParam(':empEmail', $_POST['empEmail']);
            $stmt->bindParam(':empPassword',$_POST['empPassword']);

            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'Successfully.'];
                echo json_encode($response);
            } else {
                $response = ['status' => 0, 'message' => 'Failed to create record.'];
                echo json_encode($response);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 0, 'message' => 'Error: ' . $e->getMessage()]);
        }
        break;
}
?>
